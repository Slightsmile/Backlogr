import { useGameCover } from '../hooks/useGameCover';
import { StatusBadge } from './StatusBadge';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export const GameCard = ({ game, index = 0 }) => {
    const { coverUrl, loading } = useGameCover(game.title);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all group"
        >
            <div className="aspect-[3/4] bg-slate-800 relative overflow-hidden">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center animate-pulse bg-slate-800">
                        <Gamepad2 className="w-8 h-8 text-slate-600 animate-bounce" />
                    </div>
                ) : coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading={index < 12 ? "eager" : "lazy"}
                        decoding="async"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    /* Fallback Pattern */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center">
                        <Gamepad2 className="w-12 h-12 text-slate-700 mb-2" />
                        <span className="text-slate-500 text-sm font-bold leading-tight">{game.title}</span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <span className="text-white font-bold text-center">{game.title}</span>
                    <div className="mt-2">
                        <StatusBadge status={game.status} />
                    </div>
                </div>

                <div className="absolute top-2 right-2 opacity-100 group-hover:opacity-0 transition-opacity">
                    <StatusBadge status={game.status} />
                </div>
            </div>

            <div className="p-3">
                <h3 className="font-bold text-slate-100 text-sm truncate" title={game.title}>{game.title}</h3>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">{game.platform}</span>
                    <span className="text-xs font-mono text-emerald-400">
                        {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Free'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
