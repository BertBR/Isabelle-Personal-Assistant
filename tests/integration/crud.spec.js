const connection = require('../../src/database/connection')

const id = 123

describe('CRUD TEST SUITE', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('Should be able to create a user', async () => {
    const [response] = await connection('users')
      .insert({
        id: id,
        name: 'TEST',
        fc_3ds: '0334243242323',
        fc_sw: 'SW-23423423432',
        dc_3ds: '93302492340923',
        dc_sw: 'nothing',
        fruit_type: 'Apple',
        flower_type: 'violet'
      })
    expect(response).toBe(1)
  })

  it('Should be able to select a user', async () => {
    const [response] = await connection('users')
      .select('fruit_type')
      .where('id', id)
    expect(response).toHaveProperty('fruit_type')
  })

  it('Should be able to create a new turnip price', async () => {
    const [response] = await connection('turnips')
      .insert({
        dayofweek: '3',
        buy_price: '0',
        morning: '120',
        noon: '60',
        user_id: id
      })
    console.log(response)
    expect(response).toBe(1)
  })
})
