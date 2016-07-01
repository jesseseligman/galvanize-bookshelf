'use strict';

exports.seed = function(knex) {
  return knex('users_books').del()
    .then(() => {
      return knex('users_books').insert([{
        id: 1,
        book_id: 1,
        user_id: 1,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_books_id_seq', (SELECT MAX(id) FROM users_books));"
      );
    });
};
