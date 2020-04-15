
exports.up = function (knex) {
  return knex.schema.createTable('switch_users', function (table) {
    table.string('id').primary()
    table.string('username').notNullable()
    table.string('name').notNullable()
    table.string('fc')
    table.string('dc')
    table.string('fruit_type')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('switch_users')
}
