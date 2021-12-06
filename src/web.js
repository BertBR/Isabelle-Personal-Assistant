require('dotenv').config()

const ngrok = require('ngrok')

const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

async function start () {
  const externalHost = process.env.WEBHOOK_URL || await ngrok.connect(process.env.PORT)

  await bot.telegram.setWebhook(`${externalHost}/${process.env.BOT_TOKEN}`)
  console.log(`Webhook set to ${externalHost}`)

  bot.startWebhook(`/${process.env.BOT_TOKEN}`, null, process.env.PORT)
  console.log(`Webhook listening on ${externalHost}:${process.env.PORT}`)

  return bot
}

start()

module.exports = {
  bot
}
