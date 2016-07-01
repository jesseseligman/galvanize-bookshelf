'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkAuth = function(req, res, next) {
  if (!req.session.userId) {
    return res.sendStatus(401);
  }

  next();
};

router.get('/users/books', checkAuth, (req, res, next) => {
  const userId = req.session.userId;

  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where('users_books.user_id', userId)
    .then((books) => {
      if (!books) {
        return next();
      }

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/users/books/:book_id', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = Number.parseInt(req.params.book_id);

  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where({'users_books.user_id': userId, 'books.id': bookId})
    .first()
    .then((book) => {
      if (!book) {
        return res.sendStatus(404);
      }

      res.send(book);
    })
    .catch((err) => {
      next(err);
    })
});

router.post('/users/books/:book_id', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = Number.parseInt(req.params.book_id);

  knex('users_books')
    .insert({
      book_id: bookId,
      user_id: userId
    }, '*')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/users/books/:book_id', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = req.params.book_id;

  if (Number.isNaN(bookId)) {
    return next();
  }
  
  knex('users_books')
    .where('book_id', bookId)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      return knex('users_books').del()
        .where('book_id', bookId)
        .then(() => {
          delete book.id;
          res.send(book);
        });
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
