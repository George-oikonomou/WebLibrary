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

    if (!author )
        errors.push(translations.empty_author_error);
    else if (author && author.length < 3 && author.length > 50)
        errors.push(translations.author_length_error);

    if (/\d/.test(author)) {
        errors.push(translations.author_number_error);
    }


    if (!title)
        errors.push(translations.empty_title_error);
    else if (title && title.length < 3 && title.length > 100)
        errors.push(translations.title_length_error);

    if (await bookExists({author, title}))
        errors.push(translations.book_exists_error);

    if (!genre) errors.push(translations.empty_genre_error);

    if (price === "")
        errors.push(translations.empty_price_error);
    else if (price && !/^\d+(\.\d{1,2})?$/.test(price))
        errors.push(translations.invalid_price_type_error);
    else if (isNaN(price) || price < 0.01 || price > CONFIG.MAX_PRICE)
        errors.push(translations.invalid_price_error);

    return errors.length ? errors : null;
};