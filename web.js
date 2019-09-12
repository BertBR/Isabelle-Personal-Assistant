const Telegraf = require('telegraf')
const BOT_TOKEN = '952727985:AAEX8gjCL_myd9RbEOuKTekfrgzaawhZT2M'
const bot = new Telegraf(BOT_TOKEN)

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://acnlbrbot.herokuapp.com';

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)

// bot.launch({
//   webhook: {
//     domain: 'https://acnlbrbot.herokuapp.com',
//     //'https://23f43f0f.ngrok.io',
//     port: 3000,
//   }
// })

module.exports = {
    bot
}