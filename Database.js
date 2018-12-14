const uuid = require('uuid/v4')
const _ = require('lodash')
const ActionBuilder = require('./ActionBuilder')


module.exports = class Database {
    constructor(name, options = {}) {
        options = Object.assign({
            builder: ActionBuilder
        }, options)

        this.name = name
        this.newActions = []
        this.builtActions = []
        this.state = {}
        this.storageAdapter = options.storageAdapter || require('./Adapters/fsAdapter')
        this.builder = new options.builder(this.state)
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
        const ret = await this.storage.saveActions(this.newActions)
        this.newActions = []
        return ret
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
        return this.save()
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

    collection(name) {
        return Collection.make(name, this)
    }
}