// Update with your config settings.
const pg = require('pg')
pg.defaults.ssl = true
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

require('dotenv').config()

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: { directory: './src/database/seeds' }
  },

  testing: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: { directory: './src/database/seeds' }
  },

  production: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: { directory: './src/database/seeds' }
  }
}
