const { bot } = require('./web')
const { mainMenu } = require('./menu')

if (new Date().getDay() === 0) {
    bot.start((ctx) => {
        return ctx.reply('Desculpe, mas o cadastro de Turnips não funciona aos Domingos. Tente novamente amanhã!')
    })
}

bot.use(mainMenu.init({
    backButtonText: '⬅️ Voltar...',
    mainMenuButtonText: '🏠'
}))


