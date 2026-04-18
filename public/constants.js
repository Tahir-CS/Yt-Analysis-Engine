// constants.js - Shared frontend constants

export const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : window.location.origin;

export const CPM_TABLE = {
    'United States': { CPM_min: 4, CPM_max: 10 },
    Canada: { CPM_min: 3, CPM_max: 7 },
    'United Kingdom': { CPM_min: 3, CPM_max: 7 },
    Australia: { CPM_min: 3, CPM_max: 8 },
    Germany: { CPM_min: 2.5, CPM_max: 6 },
    France: { CPM_min: 2, CPM_max: 5 },
    India: { CPM_min: 0.25, CPM_max: 1 },
    Pakistan: { CPM_min: 0.2, CPM_max: 0.8 },
    Brazil: { CPM_min: 0.5, CPM_max: 1.5 },
    Russia: { CPM_min: 0.5, CPM_max: 1.5 },
    Unknown: { CPM_min: 1, CPM_max: 3 }
};
