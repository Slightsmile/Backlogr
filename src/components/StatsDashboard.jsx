export const StatsDashboard = ({ games }) => {
    const totalGames = games.length;
    const totalCost = games.reduce((acc, game) => acc + game.price, 0);

    // Platform stats
    const platforms = games.reduce((acc, game) => {
        acc[game.platform] = (acc[game.platform] || 0) + 1;
        return acc;
    }, {});

    // Sort platforms by count
    const topPlatformEntry = Object.entries(platforms).sort((a, b) => b[1] - a[1])[0];
    const topPlatform = topPlatformEntry ? topPlatformEntry[0] : 'None';
    const topPlatformCount = topPlatformEntry ? topPlatformEntry[1] : 0;

    const StatCard = ({ title, value, sub, colorClass }) => (
        <div className={`bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`}></div>
            <div className="relative z-10">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
                {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Total Games"
                value={totalGames}
                sub="In Library"
                colorClass="bg-blue-500"
            />
            <StatCard
                title="Total Value"
                value={`$${totalCost.toFixed(2)}`}
                sub="Money Spent"
                colorClass="bg-emerald-500"
            />
            <StatCard
                title="Top Platform"
                value={topPlatform}
                sub={`${topPlatformCount} Games`}
                colorClass="bg-purple-500"
            />
            <StatCard
                title="Avg. Cost"
                value={`$${totalGames > 0 ? (totalCost / totalGames).toFixed(2) : '0.00'}`}
                sub="Per Game"
                colorClass="bg-yellow-500"
            />
        </div>
    );
};
