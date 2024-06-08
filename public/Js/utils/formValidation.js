import { ELEMENTS } from '../elements.js';
import { CONFIG } from '../config.js';

export const getFormValidationErrors = (translations) => {
    const errors = [];
    const { author, title, genre, price } = getBookData();

    if (!author) errors.push(translations.empty_author_error);

    if (!title)
        errors.push(translations.empty_title_error);
    else if (title && title.length < 3)
        errors.push(translations.title_length_error);

    if (!genre) errors.push(translations.empty_genre_error);

    if (!price)
        errors.push(translations.empty_price_error);
    else if (isNaN(price) || price < 0 || price > CONFIG.MAX_PRICE)
        errors.push(translations.invalid_price_error);

    return errors.length ? errors : null;
};

export const getBookData = () => {
    let author = ELEMENTS.author.value.trim();
    let title = ELEMENTS.title.value.trim();
    let genre = ELEMENTS.genreSelect.value;
    let price = ELEMENTS.price.value.trim();

    return { author, title, genre, price };
};
