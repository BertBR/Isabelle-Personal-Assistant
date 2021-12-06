/* eslint-disable eqeqeq */
const connection = require('./database/connection')
let list3ds, listSw

async function setOperations (today) {
  console.log('>>> Operations Checked!!! <<<')
  if (today === 0) {
    const { cod } = await connection('operations')
      .select('cod').first()
    if (cod === 'week') {
      await connection('3ds_turnips').del()
      await connection('switch_turnips').del()
      return connection('operations').update('cod', 'sunday')
    }
  }

  if (today === 1) {
    const { cod } = await connection('operations')
      .select('cod').first()

    if (cod === 'sunday') {
      await connection('3ds_turnips').del()
      await connection('switch_turnips').del()
      return connection('operations').update('cod', 'week')
    }
  }
}

function checkIfSunday (today) {
  if (today !== 0) {
    return 'Função disponível somente aos Domingos!\nDigite /start para voltar!'
  }
  return 'Informe o preço de compra:'
}

function checkWeekDay (ctx, today) {
  if (today === 0) {
    ctx.reply(
      'Função disponível somente de Segunda a Sábado!\nDigite /start para voltar!'
    )
    return
  }
  return 'Escolha uma opção:'
}

async function checkUser ({ userId, flag }) {
  if (flag === '3ds') {
    const [user] = await connection('3ds_users')
      .where('id', userId)
      .select('id')

    return user
  }
  const [user] = await connection('switch_users')
    .where('id', userId)
    .select('id')

  return user
}

async function checkTurnipSell ({ today, userId, flag }) {
  if (flag === '3ds') {
    const [turnip] = await connection('3ds_turnips')
      .where({
        week_day: today,
        user_id: userId
      })
      .select('morning', 'noon')
    return turnip
  }
  const [turnip] = await connection('switch_turnips')
    .where({
      week_day: today,
      user_id: userId
    })
    .select('morning', 'noon')
  return turnip
}

async function checkTurnipBuy ({ ctx, flag }) {
  if (flag === '3ds') {
    const [turnip] = await connection('3ds_turnips')
      .where('user_id', ctx.message.from.id)
      .select('user_id')
    return turnip
  }
  const [turnip] = await connection('switch_turnips')
    .where('user_id', ctx.message.from.id)
    .select('user_id')
  return turnip
}

async function createUserDA ({ ctx }) {
  const userId = ctx.message.from.id
  const user = await checkUser({ userId })
  const userFirstName = ctx.message.from.first_name
  const username = ctx.message.from.username
  const userMsg = ctx.message.text

  if (!user) {
    await connection('switch_users').insert({
      id: userId,
      username: username,
      name: userFirstName,
      dc: userMsg
    })
    return ctx.reply(`DA - ${userMsg} cadastrado com sucesso!`)
  }

  await connection('switch_users').where('id', userId).update({
    name: userFirstName,
    username: username,
    dc: userMsg
  })
  return ctx.reply(`DA - ${userMsg} cadastrado com sucesso!`)
}

async function createUserFC ({ ctx, flag }) {
  const userId = ctx.message.from.id
  const user = await checkUser({ userId: userId, flag: flag })

  const userFirstName = ctx.message.from.first_name
  const username = ctx.message.from.username
  const userMsg = ctx.message.text

  if (user === undefined) {
    if (flag === '3ds') {
      await connection('3ds_users').insert({
        id: userId,
        username: username,
        name: userFirstName,
        fc: userMsg
      })
      return ctx.reply(`FC - ${flag} cadastrado com sucesso!`)
    }
    await connection('switch_users').insert({
      id: userId,
      username: username,
      name: userFirstName,
      fc: userMsg
    })
    return ctx.reply(`FC - ${flag} cadastrado com sucesso!`)
  }

  if (flag === '3ds') {
    await connection('3ds_users').where('id', userId).update({
      name: userFirstName,
      username: username,
      fc: userMsg
    })
    return ctx.reply(`FC - ${flag} cadastrado com sucesso!`)
  }

  await connection('switch_users').where('id', userId).update({
    name: userFirstName,
    username: username,
    fc: userMsg
  })
  return ctx.reply(`FC - ${flag} cadastrado com sucesso!`)
}

async function ListDC ({ ctx }) {
  let list = await connection('switch_users').select(
    'name',
    'username',
    'dc',
    'fruit_type'
  )

  list = list.map((element) => {
    if (element.dc !== null) {
      checkValue(element)
      return `[${element.name}](http://t.me/${element.username})  ➡️  ${element.dc} ${element.fruit_type}\n`
    }
  })

  if (list.length === 0) {
    return ctx.reply('Não há DAs cadastrados!')
  }

  return ctx.replyWithMarkdown(
    `*Aqui está a lista de Dream Address:*\n\n${list
      .toString()
      .replace(/,/g, '')}`,
    { disable_web_page_preview: true }
  )
}

async function listFC ({ ctx, flag }) {
  if (flag === '3ds') {
    list3ds = await connection('3ds_users').select(
      'name',
      'username',
      'fc',
      'fruit_type'
    )

    list3ds = list3ds.map((element) => {
      if (element.fc !== null) {
        checkValue(element)
        return `[${element.name}](http://t.me/${element.username})  ➡️  ${element.fc} ${element.fruit_type}\n`
      }
    })

    if (list3ds[0] === undefined) {
      return ctx.reply('Não há FCs cadastrados!')
    }

    return ctx.replyWithMarkdown(
      `*Aqui está a lista de FC (3DS):*\n\n${list3ds
        .toString()
        .replace(/,/g, '')}`,
      { disable_web_page_preview: true }
    )
  }

  listSw = await connection('switch_users').select(
    'name',
    'username',
    'fc',
    'fruit_type'
  )

  listSw = listSw.map((element) => {
    if (element.fc !== null) {
      checkValue(element)
      return `[${element.name}](http://t.me/${element.username})  ➡️  ${element.fc} ${element.fruit_type}\n`
    }
  })

  if (listSw[0] === undefined) {
    return ctx.reply('Não há FCs cadastrados!')
  }

  return ctx.replyWithMarkdown(
    `*Aqui está a lista de FC (SWITCH):*\n\n${listSw
      .toString()
      .replace(/,/g, '')}`,
    { disable_web_page_preview: true }
  )
}

async function registerTurnipsBuy ({ ctx, flag }) {
  const userId = ctx.message.from.id
  const user = await checkUser({ userId: userId, flag: flag })
  const turnip = await checkTurnipBuy({ ctx: ctx, flag: flag })

  const price = ctx.message.text

  if (user === undefined) {
    return ctx.reply(
      'Você ainda não cadastrou seu FC. Por favor, cadastre-se antes de inserir os preços dos Turnips'
    )
  }

  if (turnip === undefined) {
    if (flag === '3ds') {
      await connection('3ds_turnips').insert({
        buy_price: price,
        user_id: userId
      })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }
    await connection('switch_turnips').insert({
      buy_price: price,
      user_id: userId
    })
    return ctx.reply(`Você cadastrou o valor: ${price}`)
  }

  if (turnip.user_id == userId) {
    if (flag === '3ds') {
      await connection('3ds_turnips').where('user_id', userId).update({
        buy_price: price
      })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }

    await connection('switch_turnips').where('user_id', userId).update({
      buy_price: price
    })
    return ctx.reply(`Você cadastrou o valor: ${price}`)
  }
}

async function registerTurnipsSell ({ ctx, today, flag, flagTime }) {
  const userId = ctx.message.from.id
  const price = ctx.message.text
  const user = await checkUser({ userId: userId, flag: flag })

  if (user === undefined) {
    return ctx.reply(
      'Você ainda não cadastrou seu FC. Por favor, cadastre-se antes de inserir os preços dos Turnips'
    )
  }

  const turnip = await checkTurnipSell({
    today: today,
    userId: userId,
    flag: flag
  })

  if (turnip === undefined) {
    // 3ds - First Record
    if (flag === '3ds') {
      if (flagTime === 'morning') {
        await connection('3ds_turnips').where('user_id', userId).insert({
          morning: price,
          week_day: today,
          user_id: userId
        })
        return ctx.reply(`Você cadastrou o valor: ${price}`)
      }
      await connection('3ds_turnips').where('user_id', userId).insert({
        noon: price,
        week_day: today,
        user_id: userId
      })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }

    // Switch - First Record
    if (flag === 'Switch') {
      if (flagTime === 'morning') {
        await connection('switch_turnips').where('user_id', userId).insert({
          morning: price,
          week_day: today,
          user_id: userId
        })
        return ctx.reply(`Você cadastrou o valor: ${price}`)
      }
      await connection('switch_turnips').where('user_id', userId).insert({
        noon: price,
        week_day: today,
        user_id: userId
      })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }
  }

  // 3ds - Update
  if (flag === '3ds') {
    if (flagTime === 'morning') {
      await connection('3ds_turnips')
        .where({
          user_id: userId,
          week_day: today
        })
        .update({
          morning: price
        })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }
    if (flagTime === 'noon') {
      await connection('3ds_turnips')
        .where({
          user_id: userId,
          week_day: today
        })
        .update({
          noon: price
        })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }
  }

  // Switch - Update

  if (flag === 'Switch') {
    if (flagTime === 'morning') {
      await connection('switch_turnips')
        .where({
          user_id: userId,
          week_day: today
        })
        .update({
          morning: price
        })
      return ctx.reply(`Você cadastrou o valor: ${price}`)
    }
    await connection('switch_turnips')
      .where({
        user_id: userId,
        week_day: today
      })
      .update({
        noon: price
      })
    return ctx.reply(`Você cadastrou o valor: ${price}`)
  }
}

function checkValue (element) {
  if (element.morning === null) {
    element.morning = 0
  }
  if (element.noon === null) {
    element.noon = 0
  }
  if (element.hasOwnProperty('fruit_type')) {
    if (element.fruit_type === null) {
      element.fruit_type = ''
    }
  }
  if (element.buy_price === null) {
    element.buy_price = 0
  }
}

async function listTurnips ({ ctx, flag, today }) {
  let list

  // List Turnips Sunday (Buy Price)
  if (today === 0) {
    if (flag === '3ds') {
      list = await connection('3ds_turnips')
        .join('3ds_users', 'id', '=', '3ds_turnips.user_id')
        .select('name', 'username', 'buy_price')
    } else {
      list = await connection('switch_turnips')
        .join('switch_users', 'id', '=', 'switch_turnips.user_id')
        .select('name', 'username', 'buy_price')
    }
    const sunday = list.map((element) => {
      checkValue(element)
      return `[${element.name}](http://t.me/${element.username}) : *${element.buy_price}*\n`
    })

    const finalList = `==========${flag}==========\n*Preço de Compra(Domingo)*\n\n${sunday}\n==========${flag}==========`

    return ctx.replyWithMarkdown(finalList.toString().replace(/,/g, ''), {
      disable_web_page_preview: true
    })
  }

  // List Turnips Monday-Saturday (Sell Price)
  if (flag === '3ds') {
    list = await connection('3ds_turnips')
      .join('3ds_users', 'id', '=', '3ds_turnips.user_id')
      .select('week_day', 'name', 'username', 'morning', 'noon')
  } else {
    list = await connection('switch_turnips')
      .join('switch_users', 'id', '=', 'switch_turnips.user_id')
      .select('week_day', 'name', 'username', 'morning', 'noon')
  }
  // List's creation for each day of week

  const monday = list.map((element) => {
    checkValue(element)
    if (element.week_day == 1) {
      return `[${element.name}](http://t.me/${element.username}): Manhã(*${element.morning}*) / Tarde(*${element.noon}*)\n`
    }
  })

  const tuesday = list.map((element) => {
    checkValue(element)
    if (element.week_day == 2) {
      return `[${element.name}](http://t.me/${element.username}): Manhã(*${element.morning}*) / Tarde(*${element.noon}*)\n`
    }
  })

  const wednesday = list.map((element) => {
    checkValue(element)
    if (element.week_day == 3) {
      return `[${element.name}](http://t.me/${element.username}): Manhã(*${element.morning}*) / Tarde(*${element.noon}*)\n`
    }
  })

  const thursday = list.map((element) => {
    checkValue(element)
    if (element.week_day == 4) {
      return `[${element.name}](http://t.me/${element.username}): Manhã(*${element.morning}*) / Tarde(*${element.noon}*)\n`
    }
  })

  const friday = list.map((element) => {
    checkValue(element)
    if (element.week_day == 5) {
      return `[${element.name}](http://t.me/${element.username}): Manhã(*${element.morning}*) / Tarde(*${element.noon}*)\n`
    }
  })

  const saturday = list.map((element) => {
    checkValue(element)
    if (element.week_day == 6) {
      return `[${element.name}](http://t.me/${element.username}): Manhã(*${element.morning}*) / Tarde(*${element.noon}*)\n`
    }
  })

  // List's assembly

  const finalList = `==========${flag}==========
            *Segunda-Feira*\n${monday}
            *Terça-Feira*\n${tuesday}
            *Quarta-Feira*\n${wednesday}
            *Quinta-Feira*\n${thursday}
            *Sexta-Feira*\n${friday}
            *Sábado*\n${saturday}\n==========${flag}==========`

  return ctx.replyWithMarkdown(finalList.toString().replace(/,/g, ''), {
    disable_web_page_preview: true
  })
}

async function registerFruit ({ ctx, flag, key }) {
  const userId = ctx.from.id
  const user = await checkUser({ userId: userId, flag: flag })

  if (user === undefined) {
    return ctx.reply(
      'Você ainda não cadastrou seu FC. Por favor, cadastre-se antes de informar sua fruta nativa'
    )
  }

  if (flag === '3ds') {
    await connection('3ds_users').where('id', userId).update({
      fruit_type: key
    })
    return ctx.reply(`A fruta ${key} foi cadastrada com sucesso!`)
  }

  await connection('switch_users').where('id', userId).update({
    fruit_type: key
  })
  return ctx.reply(`A fruta ${key} foi cadastrada com sucesso!`)
}

module.exports = {
  setOperations,
  createUserFC,
  listFC,
  listTurnips,
  checkIfSunday,
  checkWeekDay,
  registerTurnipsBuy,
  registerTurnipsSell,
  registerFruit,
  createUserDA,
  ListDC
}
