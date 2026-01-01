import { useState, useEffect } from 'react';
import { fetchLibraryData } from '../services/sheetService';

export const useLibraryData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const reload = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const rawRows = await fetchLibraryData();

                // Find header row index (starts with "Name" and either "Sources" or "Platform")
                const headerRowIndex = rawRows.findIndex(row => row[0] === 'Name' && (row[1] === 'Sources' || row[1] === 'Platform'));
                if (headerRowIndex === -1) throw new Error("Could not find valid header row in CSV");

                const dataRows = rawRows.slice(headerRowIndex + 1);

                // Create a price map from "Games Bought" (cols E-G: indices 4,5,6) and "Prime Gaming" (cols I-K: indices 8,9,10)
                const priceMap = new Map();
                dataRows.forEach(row => {
                    // Games Bought section: Name in col E (index 4), Price in col G (index 6)
                    const boughtName = row[4];
                    const boughtPrice = row[6];
                    if (boughtName && boughtPrice) {
                        const priceVal = parseFloat((boughtPrice || '0').toString().replace(/[^0-9.]/g, ''));
                        if (!isNaN(priceVal) && priceVal > 0) {
                            priceMap.set(boughtName.toLowerCase().trim(), priceVal);
                        }
                    }

                    // Prime Gaming section: Name in col I (index 8), Price in col K (index 10)
                    const primeName = row[8];
                    const primePrice = row[10];
                    if (primeName && primePrice) {
                        const priceVal = parseFloat((primePrice || '0').toString().replace(/[^0-9.]/g, ''));
                        if (!isNaN(priceVal) && priceVal > 0) {
                            priceMap.set(primeName.toLowerCase().trim(), priceVal);
                        }
                    }
                });

                // Parse Main List (Cols A=0 (Name), B=1 (Platform), C=2 (Status))
                const normalized = dataRows
                    .filter(row => row[0]) // Filter empty names
                    .map((row, index) => {
                        const title = row[0];
                        const platform = row[1] || 'Other';

                        // Status is now in column 2 as text: "Played", "Backlog", or "Archive"
                        // Use the exact status from the sheet
                        const statusValue = (row[2] || '').trim();
                        const status = statusValue || 'Archive'; // Default to Archive if empty

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
    }, [refreshTrigger]);

    return { data, loading, error, reload };
};
