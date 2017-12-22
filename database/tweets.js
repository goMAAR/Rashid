'use strict';
//var bookshelf = require('../knexfile.js');
var bookshelf = require('./bookshelf');

require('./users.js');
var Tweet = bookshelf.Model.extend({
  tableName: 'tweets',
  user_id: function() {
    return this.belongsTo('User');
  }
});

module.exports = bookshelf.model('Tweet', Tweet);