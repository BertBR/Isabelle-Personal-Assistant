
exports.up = function (knex) {
  return knex.schema.createTable('operations', function (table) {
    table.increments()

    table.string('cod').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('operations')
}
