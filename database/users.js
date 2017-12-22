'use strict';
// var bookshelf = require('../knexfile.js');
var bookshelf = require('./bookshelf.js');

require('./tweets.js');

var User = bookshelf.Model.extend({
  tableName: 'users', 
  user_id: function() {
    return this.hasMany('Tweet');
  }
});

module.exports = bookshelf.model('User', User);