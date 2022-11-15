const {
	tables,
} = require('..');

module.exports = {
	up: async (knex) => {
		await knex.schema.alterTable(tables.user, (table) => {
			table.string('auth0id', 255)
				.notNullable();
		});
	},
	down: (knex) => {
		return knex.schema.dropTableIfExists(tables.user);
	},
};