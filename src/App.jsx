import { useState, useMemo, useEffect } from 'react';
import { useLibraryData } from './hooks/useLibraryData';
import { ProfileStats } from './components/ProfileStats';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { GameGrid } from './components/GameGrid';
import { Pagination } from './components/Pagination';

function App() {
  const { data, loading, error, reload } = useLibraryData();
  const [showHelp, setShowHelp] = useState(false);

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
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-full border bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 hover:text-blue-400 transition-all"
              title="Help & Usage Guide"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

        {/* Help Modal */}
        {showHelp && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowHelp(false)}
          >
            <div
              className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 sm:p-6 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  📖 Help & Usage Guide
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Quick Start */}
                <section>
                  <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <span>🚀</span> Quick Start
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Click the <strong className="text-white">"Sheet"</strong> link to view/edit your Google Sheet</li>
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Use the <strong className="text-white">reload button (🔄)</strong> to refresh data from your sheet</li>
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Click the <strong className="text-white">BACKLOGR</strong> title to reset all filters</li>
                  </ul>
                </section>

                {/* Status Badges */}
                <section>
                  <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <span>🎯</span> Status Badge Colors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/50">Completed</span>
                      <span className="text-slate-400">Finished games</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-green-500/20 text-green-300 border border-green-500/50">Playing</span>
                      <span className="text-slate-400">Currently playing</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/50">Played</span>
                      <span className="text-slate-400">Games you've played</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">Backlog</span>
                      <span className="text-slate-400">Waiting to play</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-red-500/20 text-red-300 border border-red-500/50">Archive</span>
                      <span className="text-slate-400">Archived games</span>
                    </div>
                  </div>
                </section>

                {/* Filtering */}
                <section>
                  <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <span>🔍</span> Filtering & Search
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex gap-2"><span className="text-emerald-400">•</span> <strong className="text-white">Search:</strong> Type game names to filter instantly</li>
                    <li className="flex gap-2"><span className="text-emerald-400">•</span> <strong className="text-white">Platform:</strong> Filter by Steam, Epic, GOG, etc.</li>
                    <li className="flex gap-2"><span className="text-emerald-400">•</span> <strong className="text-white">Status:</strong> Filter by game completion status</li>
                    <li className="flex gap-2"><span className="text-emerald-400">•</span> <strong className="text-white">Sort:</strong> Order by name or price (high/low)</li>
                  </ul>
                </section>

                {/* Statistics */}
                <section>
                  <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span>📊</span> Statistics
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex gap-2"><span className="text-yellow-400">•</span> <strong className="text-white">Total Played:</strong> Counts both "Completed" and "Played" games</li>
                    <li className="flex gap-2"><span className="text-yellow-400">•</span> <strong className="text-white">Total Wasted:</strong> Money spent from "Games Bought" & "Prime Gaming" sections</li>
                    <li className="flex gap-2"><span className="text-yellow-400">•</span> <strong className="text-white">Platform Stats:</strong> Game count per platform (Steam, Epic, GOG, etc.)</li>
                  </ul>
                </section>

                {/* Tips */}
                <section className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                    <span>💡</span> Pro Tips
                  </h3>
                  <ul className="space-y-1 text-slate-300 text-sm">
                    <li className="flex gap-2"><span className="text-blue-400">→</span> Game covers are fetched automatically from RAWG API</li>
                    <li className="flex gap-2"><span className="text-blue-400">→</span> Hover over game cards to see full title and status</li>
                    <li className="flex gap-2"><span className="text-blue-400">→</span> Pagination shows 24 games per page (6×4 grid)</li>
                    <li className="flex gap-2"><span className="text-blue-400">→</span> Mobile responsive - works great on phones and tablets</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
