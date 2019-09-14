require('dotenv').config()
const Telegraf = require('telegraf')
const dfs = require('dropbox-fs')({
    apiKey: process.env.DROPBOX_KEY
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.telegram.setWebhook(`${process.env.URL}/bot${process.env.BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, process.env.PORT)

module.exports = {
    bot, dfs
}