const uuid = require('uuid/v4')
const _ = require('lodash')

class Storage {
    constructor(name, adapter) {
        this.name = name
        this.adapter = adapter
    }

    async initialize() {
        await this.createDatabase()
    }

    static async make(...args) {
        const instance = new this(...args)
        await instance.initialize()
        return instance
    }

    async createDatabase() {
        const list = await this.adapter.list()

        if(list.includes(this.name+ '.index')) {
            return true
        } else {
            this.adapter.write(this.name + '.index')
        }
    }

    saveAction(action) {
        return this.adapter.write(this.name + '.actions.' + action.name, JSON.stringify(action))
    }
    async saveActions(actions) {
        return Promise.all(actions.map(action => this.saveAction(action)))
    }

    async getAction(name) {
        const raw = await this.adapter.read(this.name + '.actions.' + name)
        return JSON.parse(raw)
    }
    async getActions() {
        const list = (await this.adapter.list()).filter(name => name.indexOf(this.name + '.actions.') == 0).map(name => name.replace(this.name + '.actions.', '')) 
        return await Promise.all(list.map( name => this.getAction(name) ))
    }
}

module.exports = class Database {
    constructor(name, options = {}) {
        options = Object.assign({
        }, options)

        this.name = name
        this.newActions = []
        this.builtActions = []
        this.state = {}
        this.storageAdapter = options.storageAdapter || require('./Adapters/fsAdapter')
    }

    async initialize() {
        this.storage = await Storage.make(this.name+'.sb', this.storageAdapter)
        this.refresh()
    }

    static async make(...args) {
        const instance = new this(...args)
        await instance.initialize()
        return instance
    }

    async save() {
        return this.storage.saveActions(this.newActions)
    }

    async refresh() {
        const actions = await this.storage.getActions()
        this.builder.build(actions)
        return true
    }

    addAction(action) {
        action.timestamp = new Date().getTime()
        action.name = action.timestamp + '-' + uuid()
        action.value = JSON.stringify(action.value)
        this.newActions.push(action)
        this.builder.build([action])
    }

    update(path, value) {
        return this.addAction({ type: 'update', path, value })
    }

    push(path, value) {
        return this.patch(path, [value])
    }

    delete(path) {
        return this.addAction({ type: 'delete', path })
    }
    
    patch(path, value) {
        return this.addAction({ type: 'patch', path, value })
    }
}