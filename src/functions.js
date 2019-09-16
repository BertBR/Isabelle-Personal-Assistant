const Turnips = require('./class')

function checkValue(element) {
    if (element.price[0] === undefined || element.price[0] === null) {
        element.price[0] = 0
    }
    if (element.price[1] === undefined || element.price[1] === null) {
        element.price[1] = 0
    }
}

async function listPrices() {

    const [list] = await Turnips.getFileData()

    // List's creation for each day of week

    const monday = list.Mon.map(element => {
        checkValue(element)
        return `${element.name}: Manhã(${element.price[0]}) / Tarde(${element.price[1]})\n`
    })

    const tuesday = list.Tue.map(element => {
        checkValue(element)
        return `${element.name}: Manhã(${element.price[0]}) / Tarde(${element.price[1]})\n`
    })

    const wednesday = list.Wed.map(element => {
        checkValue(element)
        return `${element.name}: Manhã(${element.price[0]}) / Tarde(${element.price[1]})\n`
    })

    const thursday = list.Thu.map(element => {
        checkValue(element)
        return `${element.name}: Manhã(${element.price[0]}) / Tarde(${element.price[1]})\n`
    })

    const friday = list.Fri.map(element => {
        checkValue(element)
        return `${element.name}: Manhã(${element.price[0]}) / Tarde(${element.price[1]})\n`
    })

    const saturday = list.Sat.map(element => {
        checkValue(element)
        return `${element.name}: Manhã(${element.price[0]}) / Tarde(${element.price[1]})\n`
    })

    // List's assembly

    const finalList = `========================
            *Segunda-Feira*\n${monday}
            *Terça-Feira*\n${tuesday}
            *Quarta-Feira*\n${wednesday}
            *Quinta-Feira*\n${thursday}
            *Sexta-Feira*\n${friday}
            *Sábado*\n${saturday}\n========================`

    return finalList.toString().replace(/,/g, '')
}

module.exports = {
    listPrices
}