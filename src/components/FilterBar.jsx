import { Search } from 'lucide-react';

export const FilterBar = ({
    search, setSearch,
    platformFilter, setPlatformFilter,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
    platforms, statuses
}) => {
    return (
        <div className="bg-slate-800/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 mb-4 sm:mb-6 sticky top-2 sm:top-4 z-20 shadow-xl">
            <div className="flex flex-col gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none placeholder-slate-600 transition-all"
                    />
                </div>

                {/* Filters - Full width on mobile */}
                <div className="flex flex-wrap gap-2 w-full items-center">
                    <FilterSelect
                        value={platformFilter}
                        onChange={setPlatformFilter}
                        options={['All', ...platforms]}
                        label="Platform"
                    />
                    <FilterSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={['All', ...statuses]}
                        label="Status"
                    />
                    <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block"></div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="name">A-Z</option>
                        <option value="price_high">Price: High</option>
                        <option value="price_low">Price: Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const FilterSelect = ({ value, onChange, options, label }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex-1 sm:flex-initial sm:max-w-[120px]"
    >
        {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label}s` : o}</option>)}
    </select>
);
