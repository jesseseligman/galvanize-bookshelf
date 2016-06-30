'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex')

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const newBook = req.body

  if (!newBook.title || newBook.title.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Title must not be blank');
  }

  if (!newBook.genre || newBook.genre.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Genre must not be blank');
  }

  if (!newBook.description || newBook.description.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Description must not be blank');
  }

  if (!newBook.cover_url || newBook.cover_url.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Cover url must not be blank');
  }

  const authorId = Number.parseInt(newBook.author_id);

  if (Number.isNaN(authorId)) {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Author id is invalid');
  }

  knex('authors')
    .where('id', authorId)
    .first()
    .then((author) => {
      if (!author) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('No author with that id exists');
      }

      knex('books')
        .insert(newBook, '*')
        .then((books) => {
          res.send(books[0]);
        })
        .catch((err) => {
          next(err);
        });
    });
});

router.patch('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }
  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('No book with that id exists');
      }

      const authorId = Number.parseInt(req.body.author_id) || book.author_id;

      if (Number.isNaN(authorId)) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('Author id is invalid');
      }

      knex('authors')
        .where(id, authorId)
        .first()
        .then((author) => {
          if (!author) {
            return res
              .status(400)
              .set('Content-Type', 'text/plain')
              .send('No author with that id exists');
          }
          knex('books')
            .update(req.body, '*')
            .where('id', req.params.id)
            .then((books) => {
              res.send(books[0]);
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });
    });
});

router.delete('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('No book with that id exists')
      }

      return knex('books').del()
        .where('id', req.params.id)
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
