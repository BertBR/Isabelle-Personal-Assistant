const Telegraf = require('telegraf')

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)
const PORT = process.env.PORT || 3000;
const URL = process.env.URL

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)

module.exports = {
    bot
}