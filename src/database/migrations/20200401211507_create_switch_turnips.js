
exports.up = function (knex) {
  return knex.schema.createTable('switch_turnips', function (table) {
    table.string('week_day')
    table.string('buy_price')
    table.string('morning')
    table.string('noon')

    table.string('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('switch_users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('turnips')
}
