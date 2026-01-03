import { GameCard } from './GameCard';
import { motion, AnimatePresence } from 'framer-motion';

export const GameGrid = ({ games }) => {
    if (games.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                <p className="text-slate-400 text-lg">No games found matching your filters.</p>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
            <AnimatePresence mode="wait">
                {games.map((game, index) => (
                    <GameCard
                        key={`${game.title}-${index}`}
                        game={game}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
