export const StatusBadge = ({ status }) => {
    const statusColors = {
        'Completed': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
        'Backlog': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        'Playing': 'bg-green-500/20 text-green-300 border-green-500/50',
        'Played': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
        'Archive': 'bg-red-500/20 text-red-300 border-red-500/50',
        'Other': 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    };

    const colorClass = statusColors[status] || statusColors['Other'];

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider border ${colorClass}`}>
            {status}
        </span>
    );
};
