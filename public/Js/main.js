import { ELEMENTS } from './elements.js';
import { state } from './state.js';
import { showFlashMessage } from './utils/flashMessage.js';
import { getFormValidationErrors, getBookData } from './utils/formValidation.js';
import { loadTranslations, applyTranslations } from './utils/translation.js';
import { fetchSearchResults ,showSearchResults , fetchAllBooks } from './utils/search.js';
import { prevPage, nextPage } from './pagination.js';

ELEMENTS.rickRollBtn.addEventListener('click', () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

ELEMENTS.addBookForm.addEventListener('submit', event => {
    event.preventDefault();

    loadTranslations(state.currentLang, () => {
        let errors = getFormValidationErrors(window.translations);

        if (errors === null)
            submitBook(getBookData());
        else
            showFlashMessage(`${window.translations.submit_error_message}<ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`, true);
    });
});

ELEMENTS.tabButtons.forEach(button => button.addEventListener("click", () => {
    ELEMENTS.tabButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    ELEMENTS.searchResultsPanel.style.display = 'none';
    ELEMENTS.panels.forEach(panel => panel.classList.toggle("active", panel.id === button.getAttribute("data-tab")));
}));

ELEMENTS.translatorBtn.addEventListener('click', () => {
    state.currentLang = state.currentLang === 'en' ? 'gr' : 'en';
    updateTranslatorHoverText();
    loadTranslations(state.currentLang, translations => {
        applyTranslations(translations);
        if (ELEMENTS.searchResultsPanel.classList.contains('active'))
            showSearchResults();
    });
});

ELEMENTS.libraryBtn.addEventListener('click', () => {
    fetchAllBooks();
});

ELEMENTS.searchBar.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const keyword = event.target.value.trim();

        if (!keyword) {
            showFlashMessage(window.translations.no_search_term_error, true);
        } else if (keyword.length < 3) {
            showFlashMessage(window.translations.search_term_length_error, true);
        } else {
            const searchSuccessMessage = window.translations.search_success_message.replace('{keyword}', keyword);

            fetchSearchResults(keyword, searchSuccessMessage);
        }
    }
});

ELEMENTS.prevPageButton.addEventListener('click', prevPage);
ELEMENTS.nextPageButton.addEventListener('click', nextPage);

const updateTranslatorHoverText = () => {
    ELEMENTS.translatorBtn.setAttribute('lang-hover-text', state.currentLang === 'en' ? 'Greek' : 'English');
    ELEMENTS.libraryBtn.setAttribute('library-hover-text', state.currentLang === 'en' ? 'Αll Books' : 'Όλα Τα βιβλία');
};

updateTranslatorHoverText();
loadTranslations(state.currentLang, applyTranslations);

const submitBook = (bookData) => {
    fetch('/books', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(bookData)})
        .then(response => {

            if (response.ok)
                showFlashMessage(translations.submit_success_message);
            else
                showFlashMessage(translations.db_error_post_message, true);

            ELEMENTS.addBookForm.reset();

        }).catch(error => {
            console.error('Error:', error);
            showFlashMessage(translations.db_error_post_message, true);
        }
    );
}
