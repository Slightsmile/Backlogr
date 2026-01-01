import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1x0zCLkBLpcGFXCJhe239hoMEtccLDpxFLIdgDxHb6x8/export?format=csv';

export const fetchLibraryData = async () => {
    return new Promise((resolve, reject) => {
        Papa.parse(SHEET_URL, {
            download: true,
            header: false, // parsing manually due to complex sheet structure
            skipEmptyLines: false, // ensure we don't lose context
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
