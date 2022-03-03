/* eslint-disable eqeqeq */
const connection = require('./database/connection')
let listSw

async function setOperations(today) {
  console.log('>>> Operations Checked!!! <<<')
  if (today === 0) {
    const { cod } = await connection('operations')
      .select('cod').first()
    if (cod === 'week') {
      await connection('switch_turnips').del()
      return connection('operations').update('cod', 'sunday')
    }
  }

  if (today === 1) {
    const { cod } = await connection('operations')
      .select('cod').first()

    if (cod === 'sunday') {
      await connection('switch_turnips').del()
      return connection('operations').update('cod', 'week')
    }
  }
}

function checkWeekDay(ctx, today) {
  if (today === 0) {
    ctx.reply(
      'Função disponível somente de Segunda a Sábado!\nDigite /start para voltar!'
    )
    return
  }
  return 'Escolha uma opção:'
}

async function checkUser({ userId }) {
  const [user] = await connection('switch_users')
    .where('id', userId)
    .select('id')

  return user
}


async function createUserDA({ ctx }) {
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

async function createUserFC({ ctx, flag }) {
  const userId = ctx.message.from.id
  const user = await checkUser({ userId: userId })

  const userFirstName = ctx.message.from.first_name
  const username = ctx.message.from.username
  const userMsg = ctx.message.text

  if (user === undefined) {
    await connection('switch_users').insert({
      id: userId,
      username: username,
      name: userFirstName,
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

async function ListDC({ ctx }) {
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

async function listFC({ ctx }) {
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

function checkValue(element) {
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

async function registerFruit({ ctx, flag, key }) {
  const userId = ctx.from.id
  const user = await checkUser({ userId: userId })

  if (user === undefined) {
    return ctx.reply(
      'Você ainda não cadastrou seu FC. Por favor, cadastre-se antes de informar sua fruta nativa'
    )
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
  checkWeekDay,
  registerFruit,
  createUserDA,
  ListDC
}
