import { useState, useMemo, useEffect } from 'react';
import { useLibraryData } from './hooks/useLibraryData';
import { ProfileStats } from './components/ProfileStats';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { GameGrid } from './components/GameGrid';
import { Pagination } from './components/Pagination';

function App() {
  const { data, loading, error, reload } = useLibraryData();

  // Filters state
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24; // 6 columns × 4 rows

  // Derive unique options
  const platforms = useMemo(() => Array.from(new Set(data.map(g => g.platform))).sort(), [data]);
  const statuses = useMemo(() => Array.from(new Set(data.map(g => g.status))).sort(), [data]);

  // Filter & Sort Logic
  const filteredGames = useMemo(() => {
    let result = [...data];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(g => g.title.toLowerCase().includes(q));
    }

    if (platformFilter !== 'All') {
      result = result.filter(g => g.platform === platformFilter);
    }

    if (statusFilter !== 'All') {
      result = result.filter(g => g.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'price_low') return a.price - b.price;
      return 0;
    });

    return result;
  }, [data, search, platformFilter, statusFilter, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, platformFilter, statusFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400 animate-pulse">Loading Library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-red-500 flex items-center justify-center p-4">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/50 max-w-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p>{error.message}</p>
          <p className="text-sm mt-4 text-slate-400">Please check your Google Sheet link and permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-3 sm:gap-0">
          <div
            onClick={() => {
              setSearch('');
              setPlatformFilter('All');
              setStatusFilter('All');
              setSortBy('name');
              setCurrentPage(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group"
          >
            <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-emerald-300 transition-all">
              BACKLOGR
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium tracking-wide mt-1 group-hover:text-slate-400 transition-colors">GAME COLLECTION TRACKER</p>
          </div>

          {/* Sheet Link and Reload Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://docs.google.com/spreadsheets/d/1x0zCLkBLpcGFXCJhe239hoMEtccLDpxFLIdgDxHb6x8"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-700 text-xs font-mono text-slate-400 hover:bg-slate-700 hover:border-blue-500 hover:text-blue-400 transition-all"
              title="View Google Sheet"
            >
              Sheet
            </a>
            <button
              onClick={reload}
              disabled={loading}
              className={`p-2 rounded-full border transition-all ${loading
                ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 hover:text-blue-400'
                }`}
              title="Reload data from Google Sheet"
            >
              <svg
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </header>

        <ProfileStats games={data} />

        <FilterBar
          search={search} setSearch={setSearch}
          platformFilter={platformFilter} setPlatformFilter={setPlatformFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          sortBy={sortBy} setSortBy={setSortBy}
          platforms={platforms}
          statuses={statuses}
        />

        <GameGrid games={paginatedGames} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <footer className="mt-12 sm:mt-20 text-center text-slate-600 text-xs pb-6 sm:pb-8 border-t border-slate-800 pt-6 sm:pt-8">
          <p>Open Source Game Library Showcase • Built with React & Tailwind</p>
        </footer>
      </div>
    </div>
  )
}

export default App
