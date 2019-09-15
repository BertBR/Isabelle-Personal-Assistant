const { dfs } = require('./web')

const { readFile, writeFile } = require('fs')

const { promisify } = require('util')

const readFileAsync = promisify(readFile)

const writeFileAsync = promisify(writeFile)

const readFileDropbox = promisify(dfs.readFile)

const writeFileDropbox = promisify(dfs.writeFile)

class Turnips {

    constructor() {
        this.NOME_ARQUIVO = 'turnips.json'
    }

    async enviarArquivoDropbox() {
        const content = await readFileAsync('./turnips.json', { encoding: 'utf8' })
        return await writeFileDropbox('/turnips.json', content, {mode: 'overwrite', encoding: 'utf8'})
    }

    async receberArquivoDropbox() {
        const content = await readFileDropbox('/turnips.json', { encoding: 'utf8' })
        return await writeFileAsync('./turnips.json', content, { encoding: 'utf8' })
    }

    async ObterDadosArquivo() {
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8')
        return JSON.parse(arquivo.toString())
    }

    async EscreverDadosArquivo(dados) {
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados))
        return true
    }

    async CadastrarPreco(horario, id, name, preco, today, dados) {
        
        let novosDados = {}
        if (horario === 1) {

            novosDados = {
                id,
                name,
                preco: []
            }

            novosDados.preco[0] = preco
        } else {

            novosDados = {
                id,
                name,
                preco: []
            }

            novosDados.preco[1] = preco
        }

        dados[today] = [...dados[today], novosDados]

        return await this.EscreverDadosArquivo([dados])

    }

    async atualizarPreco(horario, preco, today, indice, dados) {

        const atual = dados[today][indice]

        if (horario === 1) {

            atual.preco[0] = preco
        } else {

            atual.preco[1] = preco
        }

        [...dados[today], atual]

        return await this.EscreverDadosArquivo([dados]);
    }

    async verificarDia() {
        const diasSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dia = new Date().getDay()
        return diasSemana[dia]
    }

    async verificarIndice(horario, id, name, preco) {

        const [dados] = await this.ObterDadosArquivo()

        const today = await this.verificarDia()

        const indice = dados[today].findIndex(item => item.id === parseInt(id))

        if (indice === -1) {

            return await this.CadastrarPreco(horario, id, name, preco, today, dados)

        } else {

            return await this.atualizarPreco(horario, preco, today, indice, dados)
        }
    }
}

module.exports = new Turnips()