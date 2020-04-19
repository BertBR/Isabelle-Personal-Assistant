const TelegrafInlineMenu = require("telegraf-inline-menu");
const menuSwitch = new TelegrafInlineMenu("Switch Menu");
const menuTurnipsSwitch = new TelegrafInlineMenu("Escolha uma opção:");
const today = new Date().getDay();

const {
  createUserFC,
  listFC,
  listTurnips,
  checkIfSunday,
  checkWeekDay,
  registerTurnipsBuy,
  registerTurnipsSell,
  registerFruit,
  setOperations,
} = require("./functions");

const fruitMenu = new TelegrafInlineMenu("Informe sua fruta nativa:");
fruitMenu.select("fruits", ["🍎", "🍊", "🍒", "🍐", "🍑"], {
  setFunc: async (ctx, key) => {
    await registerFruit({ ctx: ctx, flag: "Switch", key: key });
  },
});

const sellMenuSwitch = new TelegrafInlineMenu((ctx) =>
  checkWeekDay(ctx, today)
);

menuSwitch
  .question("📝 Cadastrar Friend Code", "addfcsw", {
    uniqueIdentifier: "regfcsw",
    questionText: "Informe seu FC do Switch",
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^SW-[0-9]{4}-[0-9]{4}-[0-9]{4}$/i)) {
        return await createUserFC({ ctx: ctx, flag: "Switch" });
      }
      return ctx.replyWithMarkdown(
        "FC incorreto, favor informar o FC do Switch no seguinte modelo:\n*SW-1234-1234-1234*"
      );
    },
  })
  .submenu("🍎 Cadastrar Fruta Nativa", "regfruitsw", fruitMenu);
menuSwitch.submenu("🍀 Cadastrar Turnips", "regturnipssw", menuTurnipsSwitch);
menuSwitch.simpleButton("📜 Listar Friend Code", "listfcsw", {
  doFunc: async (ctx) => await listFC({ ctx, flag: "Switch" }),
});
menuSwitch.simpleButton("📈 Listar Turnips", "listturnipssw", {
  doFunc: async (ctx) => listTurnips({ ctx: ctx, flag: "Switch", today }),
});
menuTurnipsSwitch
  .question("Compra", "buyturnipssw", {
    uniqueIdentifier: "buyturnipssw",
    questionText: () => checkIfSunday(new Date().getDay()),
    setFunc: async (ctx) => {
      await setOperations(new Date().getDay());
      if (today !== 0) {
        return true;
      }
      if (ctx.message.text.match(/^\d{2,3}$/)) {
        return await registerTurnipsBuy({ ctx, flag: "Switch" });
      }

      return ctx.reply("Valor inválido, por favor insira um valor númerico!");
    },
  })
  .submenu("Venda", "sellturnipssw", sellMenuSwitch);
sellMenuSwitch
  .question("Manhã", "morningsw", {
    uniqueIdentifier: "morningsw",
    questionText: "Informe o preço da manhã!",
    setFunc: async function swMorning(ctx) {
      if (ctx.message.text.match(/^\d{2,3}$/)) {
        return await registerTurnipsSell({
          ctx: ctx,
          today: today,
          flag: "Switch",
          flagTime: "morning",
        });
      }

      return ctx.reply("Valor inválido, por favor insira um valor númerico!");
    },
  })
  .question("Tarde", "noonsw", {
    uniqueIdentifier: "noonsw",
    questionText: "Informe o preço da tarde!",
    setFunc: async (ctx) => {
      if (ctx.message.text.match(/^\d{2,3}$/)) {
        return await registerTurnipsSell({
          ctx: ctx,
          today: today,
          flag: "Switch",
          flagTime: "noon",
        });
      }

      return ctx.reply("Valor inválido, por favor insira um valor númerico!");
    },
  });

module.exports = {
  menuSwitch,
};
