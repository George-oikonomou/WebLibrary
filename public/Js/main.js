import { ELEMENTS } from './elements.js';
import { state } from './state.js';
import { showFlashMessage } from './utils/flashMessage.js';
import { getFormValidationErrors, getBookData } from './utils/formValidation.js';
import { loadTranslations, applyTranslations } from './utils/translation.js';
import { fetchSearchResults, showSearchResults, fetchAllBooks } from './utils/search.js';
import { prevPage, nextPage } from './pagination.js';

const updateTranslatorHoverText = () => {
    ELEMENTS.translatorBtn.setAttribute('lang-hover-text', state.currentLang === 'en' ? 'Greek' : 'English');
    ELEMENTS.libraryBtn.setAttribute('library-hover-text', state.currentLang === 'en' ? 'All Books' : 'Όλα Τα βιβλία');
};

const handleFormSubmit = async event => {
    event.preventDefault();
    const errors = await getFormValidationErrors(window.translations);

    if (errors.length)
        showFlashMessage(`${window.translations.submit_error_message}<ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`, true);
    else
        submitBook(getBookData());
};

const handleTabClick = button => {
    ELEMENTS.tabButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    ELEMENTS.searchResultsPanel.style.display = 'none';
    ELEMENTS.panels.forEach(panel => panel.classList.toggle("active", panel.id === button.getAttribute("data-tab")));
};

const handleTranslatorClick = () => {
    state.currentLang = state.currentLang === 'en' ? 'gr' : 'en';
    updateTranslatorHoverText();
    loadTranslations(state.currentLang, translations => {
        applyTranslations(translations);
        if (ELEMENTS.searchResultsPanel.classList.contains('active')) showSearchResults();
    });
};
const handleSearch = async keyword => {
    if (!keyword)
        showFlashMessage(window.translations.no_search_term_error, true);
    else if (keyword.length < 3)
        showFlashMessage(window.translations.search_term_length_error, true);
    else
        await fetchSearchResults(keyword, window.translations.search_success_message.replace('{keyword}', keyword));
};

const handleSearchEvent = async event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const keyword = event.target.value.trim();
        await handleSearch(keyword);
    }
};

const handleSearchIconClick = async () => {
    const keyword = ELEMENTS.searchBar.value.trim();
    await handleSearch(keyword);
};

const submitBook = bookData => {
    fetch('/books', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookData)})
        .then(response => {
            showFlashMessage(translations.submit_success_message);
            ELEMENTS.addBookForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            showFlashMessage(error, true);
        });
};

ELEMENTS.rickRollBtn.addEventListener('click', () => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
ELEMENTS.addBookForm.addEventListener('submit', handleFormSubmit);
ELEMENTS.tabButtons.forEach(button => button.addEventListener("click", () => handleTabClick(button)));
ELEMENTS.translatorBtn.addEventListener('click', handleTranslatorClick);
ELEMENTS.libraryBtn.addEventListener('click', fetchAllBooks);
ELEMENTS.searchBar.addEventListener('keypress', handleSearchEvent);
ELEMENTS.searchIcon.addEventListener('click', handleSearchIconClick);
ELEMENTS.prevPageButton.addEventListener('click', prevPage);
ELEMENTS.nextPageButton.addEventListener('click', nextPage);

updateTranslatorHoverText();
loadTranslations(state.currentLang, applyTranslations);