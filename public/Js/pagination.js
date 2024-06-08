import { ELEMENTS } from './elements.js';
import { state } from './state.js';
import { showSearchResults } from './utils/search.js';

export const prevPage = () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        showSearchResults();
    }
};

export const nextPage = () => {
    if (state.currentPage < state.totalPages) {
        state.currentPage++;
        showSearchResults();
    }
};
