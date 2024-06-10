import { ELEMENTS } from '../elements.js';
import { CONFIG } from '../config.js';

const fetchAllBooks = async () => {
    try {
        const response = await fetch('/library');
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const bookExists = async ({ author, title }) => {
    const books = await fetchAllBooks();
    return books.some(book => book.author === author && book.title === title);
};

export const getBookData = () => {
    const author = ELEMENTS.author.value.trim();
    const title = ELEMENTS.title.value.trim();
    const genre = ELEMENTS.genreSelect.value;
    const price = ELEMENTS.price.value.trim();

    return { author, title, genre, price };
};

export const getFormValidationErrors = async (translations) => {
    const errors = [];
    const {author, title, genre, price} = getBookData();

    if (!author)
        errors.push(translations.empty_author_error);
    else if ( author.length < 3 || author.length > 100)
        errors.push(translations.author_length_error);
    else if (/\d/.test(author)) {
        errors.push(translations.invalid_author_type_error);
    }

    if (!title)
        errors.push(translations.empty_title_error);
    else if (title.length < 3 || title.length > 100)
        errors.push(translations.title_length_error);

    if (!genre) errors.push(translations.empty_genre_error);

    if (!price)
        errors.push(translations.empty_price_error);
    else if (price && !/^\d+(\.\d{1,2})?$/.test(price))
        errors.push(translations.invalid_price_type_error);
    else if (isNaN(price) || price < CONFIG.MIN_PRICE || price > CONFIG.MAX_PRICE)
        errors.push(translations.invalid_price_error);

    if (!errors.length && await bookExists({author, title}))
        errors.push(translations.book_exists_error);

    return errors ?? null;
};