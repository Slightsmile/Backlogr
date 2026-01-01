import { useState, useEffect } from 'react';
import { fetchRawgGame } from '../services/rawgService';

const CACHE_PREFIX = 'game_cover_v2_';

export const useGameCover = (title) => {
    const [coverUrl, setCoverUrl] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true since we'll be fetching

    useEffect(() => {
        if (!title) {
            setLoading(false);
            return;
        }

        // Sanitize key
        const cacheKey = CACHE_PREFIX + title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cached = localStorage.getItem(cacheKey);

        console.log(`[useGameCover] ${title} - cached:`, cached);

        if (cached) {
            // Check if it's "null" or empty string (failed fetch previous time)
            // If we want to retry failed fetches, we shouldn't cache nulls forever. 
            // For now, let's assume we cache valid URLs.
            if (cached !== 'null') {
                console.log(`[useGameCover] ${title} - using cached URL`);
                setCoverUrl(cached);
                setLoading(false);
                return;
            }
        }

        let isMounted = true;
        const load = async () => {
            setLoading(true);
            console.log(`[useGameCover] ${title} - fetching from API...`);
            const game = await fetchRawgGame(title);
            console.log(`[useGameCover] ${title} - API response:`, game);

            if (isMounted) {
                if (game && game.background_image) {
                    console.log(`[useGameCover] ${title} - got image:`, game.background_image);
                    setCoverUrl(game.background_image);
                    localStorage.setItem(cacheKey, game.background_image);
                } else {
                    console.warn(`[useGameCover] ${title} - no image found`);
                    // Optional: Cache failures to avoid repeated 404 lookups?
                    // localStorage.setItem(cacheKey, 'null'); 
                    // Depending on API limits, caching failures is good.
                }
                setLoading(false);
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [title]);

    return { coverUrl, loading };
};
