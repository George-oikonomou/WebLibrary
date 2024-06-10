const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const server = express();

server.use(bodyParser.json());
server.use(express.static('public'));
server.use('/trans', express.static('trans'));

server.post('/books', (req, res) => {
    const { author, title, genre, price } = req.body;

    if (!author || !title || !genre || isNaN(price))
        return res.status(400).json({ message: 'Invalid input' });


    const statement = db.prepare(`INSERT INTO books (author, title, genre, price) VALUES (?, ?, ?, ?)`);

    statement.run([author, title, genre, price], function(err) {
        if (err)
            return res.status(500).json({ message: "database error"});
        else
            return  res.status(200).json({ message: 'Book added successfully\n' , id: this.lastID ,author : author,title: title,genre: genre,price: price});
    });

    statement.finalize();
});

server.get('/books/:keyword', (req, res) => {
    const keyword = `%${req.params.keyword}%`;
    db.all(`SELECT * FROM books WHERE title LIKE ?`, [keyword], (err, rows) => {
        if (err)
            return res.status(500).json({ message: 'Database error' });
        else
            res.json(rows);

    });
});

server.get('/Library', (req, res) => {
    db.all(`SELECT * FROM books `, (err, rows) => {
        if (err)
            return res.status(500).json({ message: 'Database error' });
        else
            return res.status(200).json(rows);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});