const TelegrafInlineMenu = require('telegraf-inline-menu')
const menu3ds = new TelegrafInlineMenu('3DS MENU')
const menuTurnips3ds = new TelegrafInlineMenu('Escolha uma opção:')
const today = new Date().getDay()

const {
  createUserFC,
  listFC,
  listTurnips,
  checkIfSunday,
  checkWeekDay,
  registerTurnipsBuy,
  registerTurnipsSell,
  registerFruit
} = require('../../functions')

const fruitMenu = new TelegrafInlineMenu('Informe sua fruta nativa:')
fruitMenu.select('fruits', ['🍎', '🍊', '🍒', '🍐', '🍑'], {
  setFunc: async (ctx, key) => {
    await registerFruit({ ctx: ctx, flag: '3ds', key: key })
  }
})

const sellMenu = new TelegrafInlineMenu((ctx) => checkWeekDay(ctx, today))

menu3ds
  .question('📝 Cadastrar Friend Code', 'addfc3ds', {
    uniqueIdentifier: 'regFC3ds',
    questionText: 'Informe seu FC do 3DS',
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/)) {
        return await createUserFC({ ctx: ctx, flag: '3ds' })
      }
      return ctx.replyWithMarkdown(
        'FC incorreto, favor informar o FC do 3ds no seguinte modelo:\n*1234-1234-1234*'
      )
    }
  })
  .submenu('🍎 Cadastrar Fruta Nativa', 'regfruit3ds', fruitMenu)
menu3ds.submenu('🍀 Cadastrar Turnips', 'regturnips3ds', menuTurnips3ds)
menu3ds.simpleButton('📜 Listar Friend Code', 'listfc3ds', {
  doFunc: async (ctx) => await listFC({ ctx, flag: '3ds' })
})

menu3ds.simpleButton('📈 Listar Turnips', 'listturnips3ds', {
  doFunc: async (ctx) => listTurnips({ ctx: ctx, flag: '3ds', today })
})
menuTurnips3ds
  .question('Compra', 'buyturnips3ds', {
    uniqueIdentifier: 'buyturnips3ds',
    questionText: () => checkIfSunday(new Date().getDay()),
    setFunc: async (ctx) => {
      if (today !== 0) {
        return true
      }
      if (ctx.message.text.match(/^\d{2,3}$/)) {
        return await registerTurnipsBuy({ ctx, flag: '3ds' })
      }

      return ctx.reply('Valor inválido, por favor insira um valor númerico!')
    }
  })
  .submenu('Venda', 'sellturnip3ds', sellMenu)
sellMenu
  .question('Manhã', 'morning3ds', {
    uniqueIdentifier: 'morning3ds',
    questionText: 'Informe o preço da manhã!',
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^\d{2,3}$/)) {
        return await registerTurnipsSell({
          ctx: ctx,
          today: today,
          flag: '3ds',
          flagTime: 'morning'
        })
      }

      return ctx.reply('Valor inválido, por favor insira um valor númerico!')
    }
  })
  .question('Tarde', 'noon3ds', {
    uniqueIdentifier: 'noon3ds',
    questionText: 'Informe o preço da tarde!',
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^\d{2,3}$/)) {
        return await registerTurnipsSell({
          ctx: ctx,
          today: today,
          flag: '3ds',
          flagTime: 'noon'
        })
      }

      return ctx.reply('Valor inválido, por favor insira um valor númerico!')
    }
  })

module.exports = {
  menu3ds
}
