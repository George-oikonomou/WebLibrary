const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./books.sqlite');
require('path');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author VARCHAR(25) NOT NULL,
        title VARCHAR(40) NOT NULL,
        genre VARCHAR(20) NOT NULL,
        price REAL NOT NULL
    )`);

    db.get("SELECT COUNT(*) as count FROM books", (err, row) => {
        if (err) {
            console.error("Error checking table:", err);
            return;
        }

        if (row.count === 0) {
            const statement = db.prepare(`INSERT INTO books (author, title, genre, price) VALUES (?, ?, ?, ?)`);
            const books = [
                ["J. R. R. Tolkien", "Lord of the Rings", "fantasy", 20.5],
                ["W. G. Sebald", "The Rings of Saturn", "fiction", 13.7]
            ];
            books.forEach(book => statement.run(book));
            statement.finalize();
        }
    });
});

module.exports = db;