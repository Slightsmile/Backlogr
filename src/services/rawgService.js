const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const queue = [];
let processing = false;

const fetchGameImpl = async (title) => {
    if (!API_KEY) {
        console.warn("RAWG API Key missing. Please add VITE_RAWG_API_KEY to your .env file.");
        return null;
    }
    try {
        const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(title)}&page_size=1`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
        console.error("Error fetching from RAWG:", error);
        return null;
    }
};

const processQueue = async () => {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
        const { title, resolve } = queue.shift();
        const result = await fetchGameImpl(title);
        resolve(result);
        // Rate limit: 200ms delay between requests (~5 req/sec)
        await new Promise(r => setTimeout(r, 200));
    }
    processing = false;
};

export const fetchRawgGame = (title) => {
    return new Promise((resolve) => {
        queue.push({ title, resolve });
        processQueue();
    });
};
