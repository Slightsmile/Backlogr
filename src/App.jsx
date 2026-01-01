import { useState, useMemo } from 'react';
import { useLibraryData } from './hooks/useLibraryData';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { GameGrid } from './components/GameGrid';

function App() {
  const { data, loading, error } = useLibraryData();

  // Filters state
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

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
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div>
            {!import.meta.env.VITE_RAWG_API_KEY && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4 text-sm font-mono text-center">
                WARNING: VITE_RAWG_API_KEY is missing in .env
              </div>
            )}
            <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
              BACKLOGR
            </h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide mt-1">GAME COLLECTION TRACKER</p>
          </div>

          {/* Summary Chip */}
          <div className="mt-4 sm:mt-0 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-xs font-mono text-slate-400">
            v1.0 • {data.length} Items
          </div>
        </header>

        <StatsDashboard games={data} />

        <FilterBar
          search={search} setSearch={setSearch}
          platformFilter={platformFilter} setPlatformFilter={setPlatformFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          sortBy={sortBy} setSortBy={setSortBy}
          platforms={platforms}
          statuses={statuses}
        />

        <GameGrid games={filteredGames} />

        <footer className="mt-20 text-center text-slate-600 text-xs pb-8 border-t border-slate-800 pt-8">
          <p>Open Source Game Library Showcase • Built with React & Tailwind</p>
        </footer>
      </div>
    </div>
  )
}

export default App
