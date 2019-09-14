const Turnips = require('./class')

function checkarValor(element) {
    if (element.preco[0] === undefined || element.preco[0] === null) {
        element.preco[0] = 0
    }
    if (element.preco[1] === undefined || element.preco[1] === null) {
        element.preco[1] = 0
    }
}

async function listarPrecos() {

    const [lista] = await Turnips.ObterDadosArquivo()

    // Criação de listas para cada dia da semana

    const monday = lista.Mon.map(element => {
        checkarValor(element)
        return `${element.name}: Manhã(${element.preco[0]}) / Tarde(${element.preco[1]})\n`
    })

    const tuesday = lista.Tue.map(element => {
        checkarValor(element)
        return `${element.name}: Manhã(${element.preco[0]}) / Tarde(${element.preco[1]})\n`
    })

    const wednesday = lista.Wed.map(element => {
        checkarValor(element)
        return `${element.name}: Manhã(${element.preco[0]}) / Tarde(${element.preco[1]})\n`
    })

    const thursday = lista.Thu.map(element => {
        checkarValor(element)
        return `${element.name}: Manhã(${element.preco[0]}) / Tarde(${element.preco[1]})\n`
    })

    const friday = lista.Fri.map(element => {
        checkarValor(element)
        return `${element.name}: Manhã(${element.preco[0]}) / Tarde(${element.preco[1]})\n`
    })

    const saturday = lista.Sat.map(element => {
        checkarValor(element)
        return `${element.name}: Manhã(${element.preco[0]}) / Tarde(${element.preco[1]})\n`
    })

    // Unificando as lista

    const listafinal = `========================
            *Segunda-Feira*\n${monday}
            *Terça-Feira*\n${tuesday}
            *Quarta-Feira*\n${wednesday}
            *Quinta-Feira*\n${thursday}
            *Sexta-Feira*\n${friday}
            *Sábado*\n${saturday}\n========================`

    return listafinal.toString().replace(/,/g, '')
}

module.exports = {
    listarPrecos
}