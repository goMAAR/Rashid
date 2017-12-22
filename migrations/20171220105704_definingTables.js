'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
    .createTableIfNotExists('users', function(table) {
      table.integer('id').unique();
      table.string('name');
      table.string('profile_sidebar_border_color');
      table.string('profile_sidebar_fill_color');
      table.boolean('profile_background_tile');
      table.string('profile_image_url');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('location');
      table.string('profile_link_color');
      table.boolean('default_profile');
      table.boolean('contributors_enabled');
      table.string('url');
      table.integer('favorites_count');
      table.integer('utc_offset');
      table.string('profile_image_url_https');
      table.boolean('profile_use_background_image');
      table.integer('listed_count');
      table.string('profile_text_color');
      table.boolean('protected');
      table.string('lang');
      table.integer('followers_count');
      table.string('time_zone');
      table.string('profile_background_image_url_https');
      table.boolean('verified');
      table.string('profile_background_color');
      table.string('description');
      table.integer('statuses_count');
      table.boolean('default_profile_image');
      table.integer('friends_count');
      table.string('profile_background_image_url');
      table.string('screen_name');
      table.boolean('is_bot');
    }), 

    knex.schema
    .createTableIfNotExists('tweets', function(table) {
      table.increments('id');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.boolean('favorited');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('truncated');
      table.string('text', 600);
      table.integer('retweet_count');
      table.boolean('retweeted');
      table.integer('in_reply_to_user_id');
      table.string('source');
      table.string('in_reply_to_screen_name');
      table.integer('in_reply_to_status_id');
      table.boolean('possibly_sensitive')
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'), 
    knex.schema.dropTable('tweets')
    ]);
};