import { ELEMENTS } from '../elements.js';
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { showFlashMessage } from './flashMessage.js';
import { loadTranslations } from './translation.js';

export const fetchSearchResults = (keyword, searchSuccessMessage) => {
    fetch(`/books/${keyword}`)
        .then(response => response.json())
        .then(data => {
            state.searchResults = data;
            state.totalPages = Math.ceil(state.searchResults.length / CONFIG.RESULTS_PER_PAGE);
            state.currentPage = 1;
            if (state.searchResults.length > 0) {

                showSearchResults();
                showFlashMessage(searchSuccessMessage);
            } else {
                showFlashMessage(window.translations.no_results, true);
                return;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showFlashMessage(window.translations.search_error_message, true);
        });


};

export const showSearchResults = () => {
    const currentPanel = document.querySelector('.panel.active');
    currentPanel.classList.remove('active');

    ELEMENTS.searchResultsPanel.style.display = 'block';
    ELEMENTS.searchResultsPanel.classList.add('active');

    loadTranslations(state.currentLang, translations => {
        ELEMENTS.searchResultsContainer.innerHTML = state.searchResults
            .slice((state.currentPage - 1) * CONFIG.RESULTS_PER_PAGE, state.currentPage * CONFIG.RESULTS_PER_PAGE)
            .map(book => `
                <div class="book">
                    <div class="title" data-translate="title_label">${translations.title_label}: ${book.title}</div>
                    <div class="author" data-translate="author_label">${translations.author_label}: ${book.author}</div>
                    <div class="genre" data-translate="genre_label">${translations.genre_label}: ${book.genre}</div>
                    <div class="price" data-translate="price_label">${translations.price_label}: ${book.price}</div>
                </div>
            `)
            .join('');
    });

    ELEMENTS.searchResultsContainer.style.display = 'grid';
    ELEMENTS.searchResultsPanel.style.display = 'block';

    updatePaginationButtons();
};

export const fetchAllBooks = () => {
    fetch('/library')
        .then(response => response.json())
        .then(data => {
            state.searchResults = data;
            state.totalPages = Math.ceil(state.searchResults.length / CONFIG.RESULTS_PER_PAGE);
            state.currentPage = 1;
            if (state.searchResults.length > 0) {
                showSearchResults();
                showFlashMessage(window.translations.library_success_message);
            } else {
                showFlashMessage(window.translations.no_results, true);
            }

        })
        .catch(error => console.error('Error:', error));

    const currentPanel = document.querySelector('.panel.active');
    currentPanel.classList.remove('active');

    ELEMENTS.searchResultsPanel.style.display = 'block';
    ELEMENTS.searchResultsPanel.classList.add('active');

    updatePaginationButtons();
}

const updatePaginationButtons = () => {
    ELEMENTS.prevPageButton.disabled = state.currentPage === 1;
    ELEMENTS.nextPageButton.disabled = state.currentPage === state.totalPages;
    ELEMENTS.pageIndicator.textContent = window.translations.page_indicator.replace('{currentPage}', state.currentPage).replace('{totalPages}', state.totalPages);
};
