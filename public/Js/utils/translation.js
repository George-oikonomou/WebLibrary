import { CONFIG } from '../config.js';
import { ELEMENTS } from '../elements.js';

export const loadTranslations = (lang, callback) => {
    fetch(`${CONFIG.TRANSLATIONS_PATH}${lang}.json`)
        .then(response => response.json())
        .then(translations => window.translations = translations)
        .then(callback)
        .catch(error => console.error('Error loading translations:', error));
};

export const applyTranslations = (translations) => {
    const selectedGenreIndex = ELEMENTS.genreSelect.selectedIndex;

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const text = key.split('.').reduce((obj, i) => obj[i], translations);

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            const iconLeftHTML = element.querySelector('.icon-left')?.outerHTML || '';
            const iconRightHTML = element.querySelector('.icon-right')?.outerHTML || '';
            element.innerHTML = `${iconLeftHTML} ${text} ${iconRightHTML}`;
        }
    });

    ELEMENTS.genreSelect.innerHTML = `<option value="" style="display: none;">${translations.genre_placeholder}</option>`;
    ELEMENTS.genreSelect.innerHTML += translations.genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
    if (selectedGenreIndex !== -1)
        ELEMENTS.genreSelect.value = ELEMENTS.genreSelect.options[selectedGenreIndex].value;
};