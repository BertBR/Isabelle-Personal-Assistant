const Telegraf = require('telegraf')
const BOT_TOKEN = '952727985:AAEX8gjCL_myd9RbEOuKTekfrgzaawhZT2M'
const config = {
	telegram: { webhookReply: true} // default true, but need to set false
}
const bot = new Telegraf(BOT_TOKEN, config)

bot.launch({
  webhook: {
    domain: 'https://acnlbrbot.herokuapp.com',
    //'https://23f43f0f.ngrok.io',
    port: 3000,
  }
})

module.exports = {
    bot
}