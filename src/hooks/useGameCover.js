import { useState, useEffect } from 'react';
import { fetchRawgGame } from '../services/rawgService';

const CACHE_PREFIX = 'game_cover_v2_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const useGameCover = (title) => {
    const [coverUrl, setCoverUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reset state when title changes - this is crucial for pagination
        setCoverUrl(null);
        setLoading(true);

        if (!title) {
            setLoading(false);
            return;
        }

        // Sanitize key
        const cacheKey = CACHE_PREFIX + title.toLowerCase().replace(/[^a-z0-9]/g, '');

        try {
            const cached = localStorage.getItem(cacheKey);

            if (cached) {
                const cacheData = JSON.parse(cached);
                const now = Date.now();

                // Check if cache is still valid
                if (cacheData.timestamp && (now - cacheData.timestamp < CACHE_EXPIRY)) {
                    if (cacheData.url && cacheData.url !== 'null') {
                        setCoverUrl(cacheData.url);
                        setLoading(false);
                        return;
                    } else if (cacheData.url === 'null') {
                        // Cached failure - don't retry for a while
                        setCoverUrl(null);
                        setLoading(false);
                        return;
                    }
                } else {
                    // Cache expired, remove it
                    localStorage.removeItem(cacheKey);
                }
            }
        } catch (e) {
            // If parsing fails, remove corrupted cache
            localStorage.removeItem(cacheKey);
        }

        let isMounted = true;

        const load = async () => {
            try {
                const game = await fetchRawgGame(title);

                if (isMounted) {
                    const cacheData = {
                        timestamp: Date.now(),
                        url: game?.background_image || 'null'
                    };

                    if (game && game.background_image) {
                        setCoverUrl(game.background_image);
                        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    } else {
                        // Cache the failure to avoid repeated API calls
                        setCoverUrl(null);
                        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error(`[useGameCover] ${title} - error:`, error);
                if (isMounted) {
                    setCoverUrl(null);
                    setLoading(false);
                }
            }
        };

        // Small delay to batch requests and avoid rate limiting
        const timeoutId = setTimeout(load, Math.random() * 100);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [title]);

    return { coverUrl, loading };
};
