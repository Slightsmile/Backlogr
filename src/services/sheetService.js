import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1x0zCLkBLpcGFXCJhe239hoMEtccLDpxFLIdgDxHb6x8/export?format=csv';

export const fetchLibraryData = async () => {
    return new Promise((resolve, reject) => {
        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
