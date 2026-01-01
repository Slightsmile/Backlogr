import { useState, useEffect } from 'react';
import { fetchLibraryData } from '../services/sheetService';

export const useLibraryData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const rawData = await fetchLibraryData();
                // Normalize data
                const normalized = rawData.map((game, index) => ({
                    id: index, // Simple index-based ID for now
                    title: game.title || 'Unknown Title',
                    platform: game.platform || 'Other',
                    price: parseFloat((game.price || '0').replace(/[^0-9.]/g, '')) || 0,
                    status: game.status || 'Backlog',
                    hours: parseFloat(game.hours) || 0,
                }));
                setData(normalized);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading, error };
};
