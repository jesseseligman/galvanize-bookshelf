'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkAuth = function(req, res, next) {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  next();
};

router.get('users/books', checkAuth, (req, res, next) => {
  const userId = req.session.user.id;

  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where('users_books.user_id', userId)
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('users/books/:book_id', checkAuth, (req, res, next) => {
  const userId = req.session.user.id;
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

router.post('users/books/:book_id', checkAuth, (req, res, next) => {
  const userId = req.session.user.id;
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

router.delete()
module.exports = router;
