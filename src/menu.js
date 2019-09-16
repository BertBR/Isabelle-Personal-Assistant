const TelegrafInlineMenu = require('telegraf-inline-menu')

const Turnips = require('./class')

const { listPrices } = require('./functions')

//Start

Turnips.downloadFromDropbox()

const mainMenu = new TelegrafInlineMenu(ctx => `Bem-Vindo ${ctx.from.first_name}!\nEscolha uma das opções abaixo:`)

const listMenu = new TelegrafInlineMenu(ctx => listPrices())

mainMenu
    .submenu('Cadastrar', 'add', new TelegrafInlineMenu('Escolha um período:'))
    .manual('Manhã', 'morning').question('', 'morning', {
        questionText: 'Informe o preço da manhã',
        setFunc: (ctx) => {
            if (Number.isInteger(+ctx.message.text)) {
                const time = 1
                Turnips.checkIndex(time, ctx.message.from.id, ctx.message.from.first_name, parseInt(ctx.message.text))
                .then(msg => {
                    Turnips.uploadToDropbox()
                    ctx.reply('Valor cadastrado com sucesso!')
                })
            } else {
                ctx.reply('Por favor, insira um número inteiro!')
            }
        }
    })
    .manual('Tarde', 'noon').question('', 'noon', {
        questionText: 'Informe o preço da tarde',
        setFunc: (ctx) => {
            if (Number.isInteger(+ctx.message.text)) {
                const time = 2
                Turnips.checkIndex(time, ctx.message.from.id, ctx.message.from.first_name, parseInt(ctx.message.text))
                    .then(msg => {
                        Turnips.uploadToDropbox()
                        ctx.reply('Valor cadastrado com sucesso!')
                    })
                } else {
                    ctx.reply('Por favor, insira um número inteiro!')
            }
        }
    })

mainMenu
    .submenu('Listar', 'list', listMenu)
mainMenu.setCommand('start')

module.exports = {
    mainMenu
}
