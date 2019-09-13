const { bot } = require('./web')
const Turnips = require('./class')
const { listarPrecos } = require('./functions')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const regex = new RegExp(/d+/)
const mainMenu = new TelegrafInlineMenu(ctx => `Bem-Vindo ${ctx.from.first_name}!\nEscolha uma das opções abaixo:`)
const cadastrarMenu = new TelegrafInlineMenu('Escolha um período:')
const listarMenu = new TelegrafInlineMenu(ctx => console.log(ctx.message.file_id))
    // listarPrecos())
const manhaMenu = new TelegrafInlineMenu('Manhã:').question('Cadastrar', 'manha', {
    questionText: 'Informe o preço da manhã',
    setFunc: (ctx) => {
        if (isNaN(ctx.message.text)) {
            ctx.reply('Por favor, insira um número inteiro!')
        } else {
            bot.hears(regex, ctx => console.log(ctx))
            ctx.reply('Valor cadastrado com sucesso!')
            const horario = 1
            Turnips.verificarIndice(horario, ctx.message.from.id, ctx.message.from.first_name, ctx.message.text)
        }
    }
})
const tardeMenu = new TelegrafInlineMenu('Tarde:').question('Cadastrar', 'tarde', {
    questionText: 'Informe o preço da tarde',
    setFunc: (ctx) => {
        if (isNaN(ctx.message.text)) {
            ctx.reply('Por favor, insira um número inteiro!')
        } else {
            bot.hears(regex, ctx => console.log(ctx))
            ctx.reply('Valor cadastrado com sucesso!')
            const horario = 2
            Turnips.verificarIndice(horario, ctx.message.from.id, ctx.message.from.first_name, ctx.message.text)
        }
    }
})

mainMenu.submenu('Cadastrar', 'cadastra', cadastrarMenu)
mainMenu.submenu('Listar', 'lista', listarMenu)
cadastrarMenu.submenu('Manhã', 'manha', manhaMenu)
cadastrarMenu.submenu('Tarde', 'tarde', tardeMenu)
mainMenu.setCommand('start')

bot.use(mainMenu.init({
    backButtonText: '⬅️ Voltar...',
    mainMenuButtonText: '🏠'
}))

