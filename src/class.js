const { dfs } = require('./web')

const { readFile, writeFile } = require('fs')

const { promisify } = require('util')

const readFileAsync = promisify(readFile)

const writeFileAsync = promisify(writeFile)

const readFileDropbox = promisify(dfs.readFile)

const writeFileDropbox = promisify(dfs.writeFile)

class Turnips {

    constructor() {
        this.FILENAME = 'turnips.json'
    }

    async uploadToDropbox() {
        const content = await readFileAsync('./turnips.json', { encoding: 'utf8' })
        return await writeFileDropbox('/turnips.json', content, {mode: 'overwrite', encoding: 'utf8'})
    }

    async downloadFromDropbox() {
        const content = await readFileDropbox('/turnips.json')
        console.log(content)
        const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const newstr = JSON.parse([content])
        for (const i in week) {
            const today = week[i]
            const idMap = newstr[0][today].map(element => {
                if(element.id === 254704367){
                    element.name = 'Débora♡'
                }
                return element
            })
            newstr[0][today] = idMap
        }
        return await writeFileAsync('./turnips.json', JSON.stringify(newstr))
    }

    async getFileData() {
        const file = await readFileAsync(this.FILENAME, 'utf8')
        return JSON.parse(file.toString())
    }

    async writeFileData(data) {
        await writeFileAsync(this.FILENAME, JSON.stringify(data))
        return true
    }

    async registerPrices(time, id, name, price, today, data) {
        
        let newData = {}
        if (time === 1) {

            newData = {
                id,
                name,
                price: []
            }

            newData.price[0] = price
        } else {

            newData = {
                id,
                name,
                price: []
            }

            newData.price[1] = price
        }

        data[today] = [...data[today], newData]

        return await this.writeFileData([data])

    }

    async updatePrices(time, price, today, index, data) {

        const actual = data[today][index]

        if (time === 1) {
            actual.price[0] = price
        } else {
            actual.price[1] = price
        }

        [...data[today], actual]

        return await this.writeFileData([data]);
    }

    async checkDay() {
        const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const day = new Date().getDay()
        return week[day]
    }

    async checkIndex(time, id, name, price) {

        const [data] = await this.getFileData()

        const today = await this.checkDay()

        const index = data[today].findIndex(item => item.id === parseInt(id))

        if (index === -1) {

            return await this.registerPrices(time, id, name, price, today, data)

        } else {

            return await this.updatePrices(time, price, today, index, data)

        }
    }
}

module.exports = new Turnips()