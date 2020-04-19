const TelegrafInlineMenu = require('telegraf-inline-menu')
const { bot } = require('./web')
const { menu3ds } = require('./menu3ds')
const { menuSwitch } = require('./menuSwitch')
const { setOperations } = require('./functions')
const mainMenu = new TelegrafInlineMenu(
  (ctx) => `Bem-Vindo ${ctx.from.first_name}!\nEscolha sua plataforma:`
)

mainMenu.submenu('3ds', 'menu3ds', menu3ds)
mainMenu.submenu('Switch', 'menuswitch', menuSwitch)
mainMenu.setCommand('start')

async function main () {
  await setOperations(new Date().getDay())

  bot.use(
    mainMenu.init({
      backButtonText: '⬅️ Voltar...',
      mainMenuButtonText: '🏠'
    })
  )
}

main()

module.exports = {
  mainMenu
}
