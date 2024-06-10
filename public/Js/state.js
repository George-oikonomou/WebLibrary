import {CONFIG} from "./config.js";

export const state = {
    currentLang: CONFIG.DEFAULT_LANG,
    hideTimeout: null,
    currentPage: 1,
    totalPages: 1,
    searchResults: []
};