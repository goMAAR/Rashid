'use strict';
var knex = require('knex')(require('../knexfile.js'));
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
module.exports = bookshelf;
