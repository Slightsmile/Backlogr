import { Gamepad2, Zap, ShoppingCart } from 'lucide-react';

export const ProfileStats = ({ games }) => {
    // Calculate stats
    const totalOwned = games.length;
    const totalPlayed = games.filter(g => g.status === 'Completed').length;

    // Use the pre-calculated totalWasted from the data hook
    // This ensures we only sum games from "Games Bought" and "Prime Gaming" sections
    const totalWasted = games.totalWasted || 0;

    // Platform counts with more comprehensive matching
    const platformCounts = games.reduce((acc, game) => {
        const platform = game.platform.toLowerCase();

        if (platform.includes('steam')) {
            acc.Steam = (acc.Steam || 0) + 1;
        } else if (platform.includes('epic')) {
            acc.Epic = (acc.Epic || 0) + 1;
        } else if (platform.includes('gog')) {
            acc.GOG = (acc.GOG || 0) + 1;
        } else if (platform.includes('ubisoft') || platform.includes('uplay')) {
            acc.Ubisoft = (acc.Ubisoft || 0) + 1;
        } else if (platform.includes('ea') || platform.includes('origin')) {
            acc.EA = (acc.EA || 0) + 1;
        } else {
            acc.Others = (acc.Others || 0) + 1;
        }
        return acc;
    }, {});

    // Compact stat card component with optional icon
    const StatCard = ({ label, value, sublabel, colorClass = 'border-blue-500', icon: Icon }) => (
        <div className={`bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border-l-4 ${colorClass} hover:bg-slate-800 transition-colors`}>
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">{label}</p>
                {Icon && <Icon className="w-4 h-4 text-slate-600" />}
            </div>
            <p className="text-2xl font-bold text-slate-100 mb-0">{value}</p>
            <p className="text-[10px] text-slate-500">{sublabel}</p>
        </div>
    );

    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-end">
                {/* Profile Picture - Left Side */}
                <div className="flex-shrink-0 md:order-1">
                    <img
                        src="/profile.jpg"
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-slate-700 shadow-xl"
                    />
                </div>

                {/* Stats Grid - Right Side - Compact 3x3 Layout */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 md:order-2 max-w-4xl md:ml-auto">
                    {/* Row 1: Total Games, Played, Total Wasted */}
                    <StatCard
                        label="TOTAL GAMES"
                        value={totalOwned}
                        sublabel="In Library"
                        colorClass="border-blue-500"
                        icon={Gamepad2}
                    />
                    <StatCard
                        label="PLAYED"
                        value={totalPlayed}
                        sublabel="Games Played"
                        colorClass="border-purple-500"
                        icon={Zap}
                    />
                    <StatCard
                        label="TOTAL WASTED"
                        value={`$${totalWasted.toFixed(2)}`}
                        sublabel="Money Spent"
                        colorClass="border-emerald-500"
                        icon={ShoppingCart}
                    />

                    {/* Row 2: Steam, Epic, GOG */}
                    <StatCard
                        label="STEAM"
                        value={platformCounts.Steam || 0}
                        sublabel="Games"
                        colorClass="border-cyan-500"
                        icon={Gamepad2}
                    />
                    <StatCard
                        label="EPIC"
                        value={platformCounts.Epic || 0}
                        sublabel="Games"
                        colorClass="border-yellow-500"
                        icon={Gamepad2}
                    />
                    <StatCard
                        label="GOG"
                        value={platformCounts.GOG || 0}
                        sublabel="Games"
                        colorClass="border-pink-500"
                        icon={Gamepad2}
                    />

                    {/* Row 3: EA, Ubisoft, Others */}
                    <StatCard
                        label="EA"
                        value={platformCounts.EA || 0}
                        sublabel="Games"
                        colorClass="border-red-500"
                        icon={Gamepad2}
                    />
                    <StatCard
                        label="UBISOFT"
                        value={platformCounts.Ubisoft || 0}
                        sublabel="Games"
                        colorClass="border-indigo-500"
                        icon={Gamepad2}
                    />
                    <StatCard
                        label="OTHERS"
                        value={platformCounts.Others || 0}
                        sublabel="Games"
                        colorClass="border-slate-500"
                        icon={Gamepad2}
                    />
                </div>
            </div>
        </div>
    );
};
