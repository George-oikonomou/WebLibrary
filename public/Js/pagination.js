import { state } from './state.js';
import { showSearchResults } from './utils/search.js';

const changePage = async (direction) => {
    if ((direction === 'prev' && state.currentPage > 1) ||
        (direction === 'next' && state.currentPage < state.totalPages)) {
        state.currentPage += direction === 'prev' ? -1 : 1;
        await showSearchResults();
    }
};

export const prevPage = () => changePage('prev');
export const nextPage = () => changePage('next');