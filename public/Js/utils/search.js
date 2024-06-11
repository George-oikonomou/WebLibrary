import {ELEMENTS} from '../elements.js';
import {CONFIG} from '../config.js';
import {state} from '../state.js';
import {showFlashMessage} from './flashMessage.js';

const updatePaginationButtons = () => {
    ELEMENTS.prevPageButton.disabled = state.currentPage === 1;
    ELEMENTS.nextPageButton.disabled = state.currentPage === state.totalPages;
    ELEMENTS.pageIndicator.textContent = window.translations.page_indicator
        .replace('{currentPage}', state.currentPage)
        .replace('{totalPages}', state.totalPages);
};

const switchToSearchResultsPanel = () => {
    const currentPanel = document.querySelector('.panel.active');
    currentPanel.classList.remove('active');
    ELEMENTS.searchResultsContainer.style.display = 'grid';
    ELEMENTS.searchResultsPanel.style.display = 'block';
    ELEMENTS.searchResultsPanel.classList.add('active');
};

const displaySearchResults = () => {
    ELEMENTS.searchResultsContainer.innerHTML = state.searchResults
        .slice((state.currentPage - 1) * CONFIG.RESULTS_PER_PAGE, state.currentPage * CONFIG.RESULTS_PER_PAGE)
        .map(book => `
            <div class="book">
                <div class="title" data-translate="title_label">  ${window.translations.title_label }: ${book.title} </div>
                <div class="author" data-translate="author_label">${window.translations.author_label}: ${book.author}</div>
                <div class="genre" data-translate="genre_label">  ${window.translations.genre_label }: ${book.genre} </div>
                <div class="price" data-translate="price_label">  ${window.translations.price_label }: ${book.price}€</div>
            </div>
        `).join('');
};

export const fetchSearchResults = async (keyword) => {
    try {
        const response = await fetch(`/books/${keyword}`);
        state.searchResults = await response.json();
        state.totalPages = Math.ceil(state.searchResults.length / CONFIG.RESULTS_PER_PAGE);
        state.currentPage = 1;

        if (state.searchResults.length > 0) {
            await showSearchResults();
            showFlashMessage( window.translations.search_success_message.replace('{keyword}', keyword));
        } else {
            const currentPanel = document.querySelector('.panel.active');
            currentPanel.classList.remove('active');
            ELEMENTS.addBookForm.style.display = 'block';
            ELEMENTS.addBookForm.classList.add('active');
            ELEMENTS.createBook.classList.add('active');
            ELEMENTS.searchResultsPanel.style.display = 'none';
            ELEMENTS.searchResultsContainer.style.display = 'none';
            showFlashMessage(window.translations.no_results, true);
        }
    } catch (error) {
        console.error('Error:\n', error);
        showFlashMessage(window.translations.error_while_fetching_results.replace('{keyword}',keyword), true);
    }
};

export const showSearchResults = async () => {
    switchToSearchResultsPanel();
    displaySearchResults();
    updatePaginationButtons();
};

export const fetchAllBooks = async () => {
    try {
        const response = await fetch('/library');
        state.searchResults = await response.json();
        state.totalPages = Math.ceil(state.searchResults.length / CONFIG.RESULTS_PER_PAGE);
        state.currentPage = 1;

        if (state.searchResults.length > 0) {
            switchToSearchResultsPanel();
            updatePaginationButtons();
            await showSearchResults();
            showFlashMessage(window.translations.library_success_message);
        } else {
            showFlashMessage(window.translations.no_results, true);
        }
    } catch (error) {
        console.error('Error:', error);
        showFlashMessage(window.translations.error_fetching_library, true);
    }
};