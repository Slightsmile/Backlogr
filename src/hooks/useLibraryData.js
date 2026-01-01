import { useState, useEffect } from 'react';
import { fetchLibraryData } from '../services/sheetService';

export const useLibraryData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const rawRows = await fetchLibraryData();

                // Find header row index (starts with "Name" and "Sources")
                const headerRowIndex = rawRows.findIndex(row => row[0] === 'Name' && row[1] === 'Sources');
                if (headerRowIndex === -1) throw new Error("Could not find valid header row in CSV");

                const dataRows = rawRows.slice(headerRowIndex + 1);

                // Create a price map from the "Games Bought" section
                // Check Line 2: Name... Name,Platform,Price (at index 5,6,7 assuming 0-indexed)
                const priceMap = new Map();
                dataRows.forEach(row => {
                    const boughtName = row[5];
                    const boughtPrice = row[7];
                    if (boughtName) {
                        const priceVal = parseFloat((boughtPrice || '0').replace(/[^0-9.]/g, ''));
                        priceMap.set(boughtName.toLowerCase().trim(), priceVal);
                    }
                });

                // Parse Main List (Cols A=0 (Name), B=1 (Platform), C=2 (Played?), D=3 (Completed?))
                const normalized = dataRows
                    .filter(row => row[0]) // Filter empty names
                    .map((row, index) => {
                        const title = row[0];
                        const platform = row[1] || 'Other';

                        let status = 'Backlog';
                        const col2 = (row[2] || '').toUpperCase(); // Played/Planning -> Playing?
                        const col3 = (row[3] || '').toUpperCase(); // Completed?

                        // Logic assumption: Col 3 (TRUE) = Completed, Col 2 (TRUE) = Playing
                        if (col3 === 'TRUE') status = 'Completed';
                        else if (col2 === 'TRUE') status = 'Playing';

                        const price = priceMap.get(title.toLowerCase().trim()) || 0;

                        return {
                            id: index,
                            title: title,
                            platform: platform,
                            price: price,
                            status: status,
                            hours: 0,
                        };
                    });
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

