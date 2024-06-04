document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
    const tabButtons = document.querySelectorAll(".tab-button");
    const panels = document.querySelectorAll(".panel");
    const translatorBtn = document.querySelector('.translator-btn');
    const addBookForm = document.getElementById('addBookForm');
    const flashMessage = document.getElementById('flashMessage');
    const genreSelect = document.getElementById('genre');
    let currentLang = 'en';
    let hideTimeout;

    const showFlashMessage = (message, isError = false) => {
        flashMessage.innerHTML = message;
        flashMessage.className = `flash-message${isError ? ' error' : ''}`;
        flashMessage.style.display = 'block';

        clearTimeout(hideTimeout);
        flashMessage.onmouseover = () => clearTimeout(hideTimeout);
        flashMessage.onmouseleave = () => hideFlashMessageWithDelay();
        hideFlashMessageWithDelay();
    };

    const hideFlashMessageWithDelay = () => {
        hideTimeout = setTimeout(hideFlashMessage, 2000);
    };

    const hideFlashMessage = () => {
        flashMessage.style.transition = 'opacity 1s ease-out';
        flashMessage.style.opacity = '0';
        setTimeout(() => {
            flashMessage.style.display = 'none';
            flashMessage.style.opacity = '1';
        }, 1000);
    };

    const loadTranslations = (lang, callback) => {
        fetch(`${lang}.json`)
            .then(response => response.json())
            .then(callback)
            .catch(error => console.error('Error loading translations:', error));
    };

    const applyTranslations = translations => {
        const selectedGenreIndex = genreSelect.selectedIndex;

        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const text = key.split('.').reduce((obj, i) => obj[i], translations);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.classList.contains('tab-button')) {
                const iconHTML = element.querySelector('i')?.outerHTML || '';
                element.innerHTML = `${iconHTML} ${text}`;
            } else {
                element.innerHTML = text;
            }
        });

        genreSelect.innerHTML = `<option value="" style="display: none;">${translations.genre_placeholder}</option>`;
        genreSelect.innerHTML += translations.genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
        if (selectedGenreIndex !== -1)
            genreSelect.value = genreSelect.options[selectedGenreIndex].value;
    };

    const applyMessageTranslations = translations => {
        const errors = [];
        const author = document.getElementById('author').value.trim();
        const title = document.getElementById('title').value.trim();
        const genre = genreSelect.value;
        const price = document.getElementById('price').value.trim();
        const maxInteger = 100000000;

        if (!author) errors.push(translations.empty_author_error);
        if (!title) errors.push(translations.empty_title_error);
        if (!genre) errors.push(translations.empty_genre_error);
        if (!price) {
            errors.push(translations.empty_price_error);
        } else if (isNaN(price) || price < 0 || price > maxInteger) {
            errors.push(translations.invalid_price_error);
        }

        if (errors.length) {
            showFlashMessage(`${translations.submit_error_message}<ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`, true);
        } else {
            showFlashMessage(translations.submit_success_message);
            // TO DO
        }
    };

    form.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.submit();
        }
    });

    addBookForm.addEventListener('submit', event => {
        event.preventDefault();
        loadTranslations(currentLang, applyMessageTranslations);
    });

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const panelId = button.getAttribute("data-tab");
            panels.forEach(panel => panel.classList.toggle("active", panel.id === panelId));
        });
    });

    translatorBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'gr' : 'en';
        updateTranslatorHoverText();
        loadTranslations(currentLang, applyTranslations);
    });

    const updateTranslatorHoverText = () => {
        translatorBtn.setAttribute('data-hover-text', currentLang === 'en' ? 'Greek' : 'English');
    };

    updateTranslatorHoverText();
    loadTranslations(currentLang, applyTranslations);
});