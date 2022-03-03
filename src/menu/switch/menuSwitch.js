const TelegrafInlineMenu = require('telegraf-inline-menu')
const menuSwitch = new TelegrafInlineMenu('Switch Menu')

const {
  createUserFC,
  listFC,
  checkWeekDay,
  registerFruit,
  createUserDA,
  ListDC
} = require('../../functions')

const fruitMenu = new TelegrafInlineMenu('Informe sua fruta nativa:')
fruitMenu.select('fruits', ['🍎', '🍊', '🍒', '🍐', '🍑'], {
  setFunc: async (ctx, key) => {
    await registerFruit({ ctx: ctx, flag: 'Switch', key: key })
  }
})

const sellMenuSwitch = new TelegrafInlineMenu((ctx) =>
  checkWeekDay(ctx, today)
)

menuSwitch
  .question('💤 Cadastrar Dream Address', 'adddasw', {
    uniqueIdentifier: 'regdasw',
    questionText: 'Informe seu DA do Switch',
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^DA-[0-9]{4}-[0-9]{4}-[0-9]{4}$/i)) {
        return createUserDA({ ctx: ctx })
      }
      return ctx.replyWithMarkdown(
        'DA incorreto, favor informar o DA do Switch no seguinte modelo:\n*DA-1234-1234-1234*'
      )
    }
  })
menuSwitch.simpleButton('📖 Listar Dream Address', 'listdasw', {
  doFunc: async (ctx) => await ListDC({ ctx })
})

menuSwitch
  .question('📝 Cadastrar Friend Code', 'addfcsw', {
    uniqueIdentifier: 'regfcsw',
    questionText: 'Informe seu FC do Switch',
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^SW-[0-9]{4}-[0-9]{4}-[0-9]{4}$/i)) {
        return await createUserFC({ ctx: ctx, flag: 'Switch' })
      }
      return ctx.replyWithMarkdown(
        'FC incorreto, favor informar o FC do Switch no seguinte modelo:\n*SW-1234-1234-1234*'
      )
    }
  })
  .submenu('🍎 Cadastrar Fruta Nativa', 'regfruitsw', fruitMenu)
menuSwitch.simpleButton('📜 Listar Friend Code', 'listfcsw', {
  doFunc: async (ctx) => await listFC({ ctx })
})

module.exports = {
  menuSwitch
}
