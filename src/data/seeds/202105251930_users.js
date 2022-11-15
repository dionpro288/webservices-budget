const {
  tables,
} = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).insert([{
        id: 1,
        name: 'Thomas Aelbrecht',
        auth0id: 'unknown',
      },
      {
        id: 2,
        name: 'Pieter Van Der Helst',
        auth0id: 'auth0|632ee656ee00e7cb2b01b9b4',
      },
      {
        id: 3,
        name: 'Karine Samyn',
        auth0id: 'unknown',
      },
    ]);
  },
};