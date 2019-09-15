const TelegrafInlineMenu = require('telegraf-inline-menu')

const Turnips = require('./class')

const { bot } = require('./web')

const { listarPrecos } = require('./functions')

//Start

Turnips.receberArquivoDropbox()

const regex = new RegExp(/d+/)

const mainMenu = new TelegrafInlineMenu(ctx => `Bem-Vindo ${ctx.from.first_name}!\nEscolha uma das opções abaixo:`)

const listarMenu = new TelegrafInlineMenu(ctx => listarPrecos())

mainMenu
    .submenu('Cadastrar', 'cadastra', new TelegrafInlineMenu('Escolha um período:'))
    .manual('Manhã', 'manha').question('', 'manha', {
        questionText: 'Informe o preço da manhã',
        setFunc: (ctx) => {
            if (isNaN(ctx.message.text)) {
                ctx.reply('Por favor, insira um número inteiro!')
            } else {
                bot.hears(regex, ctx => console.log(ctx))
                const horario = 1
                Turnips.verificarIndice(horario, ctx.message.from.id, ctx.message.from.first_name, ctx.message.text)
                    .then(msg => {
                        Turnips.enviarArquivoDropbox()
                        ctx.reply('Valor cadastrado com sucesso!')
                    })
            }
        }
    })
    .manual('Tarde', 'tarde').question('', 'tarde', {
        questionText: 'Informe o preço da tarde',
        setFunc: (ctx) => {
            if (isNaN(ctx.message.text)) {
                ctx.reply('Por favor, insira um número inteiro!')
            } else {
                bot.hears(regex, ctx => console.log(ctx))
                const horario = 2
                Turnips.verificarIndice(horario, ctx.message.from.id, ctx.message.from.first_name, ctx.message.text)
                    .then(msg => {
                        Turnips.enviarArquivoDropbox()
                        ctx.reply('Valor cadastrado com sucesso!')
                    })
            }
        }
    })

mainMenu
    .submenu('Listar', 'lista', listarMenu)
mainMenu.setCommand('start')

module.exports = {
    mainMenu
}
