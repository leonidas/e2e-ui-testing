const config = require('config');

const knex = require('knex')({
  client: 'pg',
  connection: config.database
});

module.exports = {
  createTables: async function () {
    await knex.schema.withSchema('public').createTableIfNotExists('kings', function (table) {
      table.increments();
      table.string('name');
    });
  },

  King: {
    findAll: async function () {
      return await knex.select('*').from('kings');
    },
    create: async function (data) {
      return await knex.insert(data).into('kings');
    },
    truncate: async function () {
      return await knex('kings').truncate();
    }
  }
}
