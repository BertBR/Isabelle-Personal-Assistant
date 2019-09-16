require('dotenv').config()

const ngrok = require('ngrok')

const Telegraf = require('telegraf')

const dfs = require('dropbox-fs')({
    apiKey: process.env.DROPBOX_KEY
})

const bot = new Telegraf(process.env.BOT_TOKEN_TEST)

async function start() {

    const externalHost = process.env.WEBHOOK_URL || await ngrok.connect(process.env.PORT)

    await bot.telegram.setWebhook(`${externalHost}/${process.env.BOT_TOKEN_TEST}`)
    console.log(`Webhook set to ${externalHost}`)

    bot.startWebhook(`/${process.env.BOT_TOKEN_TEST}`, null, process.env.PORT)
    console.log(`Webhook listening on http://${externalHost}:${process.env.PORT}`)

    return bot
}

start(bot)

module.exports = {
    bot, dfs
}