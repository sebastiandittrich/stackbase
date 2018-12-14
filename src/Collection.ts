import { Action, Document, StorageAdapter } from './Interfaces';
import { CollectionBuilder } from './CollectionBuilder';
import { Builder } from './Builder';


const uuid = require('uuid/v4')

export class Storage {

    constructor(public name:string, public adapter:StorageAdapter) {
        
    }

    async initialize(): Promise<any> {
        
    }

    static async make(name:string, adapter:StorageAdapter): Promise<Storage> {
        const instance = new this(name, adapter)
        await instance.initialize()
        return instance
    }

    saveAction(action:Action): Promise<boolean> {
        return this.adapter.write(this.name + '.actions.' + action.name, JSON.stringify(action))
    }
    saveActions(actions:Action[]): Promise<boolean[]> {
        return Promise.all(actions.map((action:Action) => this.saveAction(action)))
    }

    async getAction(name:string): Promise<Action> {
        const raw:string = await this.adapter.read(this.name + '.actions.' + name)
        return JSON.parse(raw)
    }
    async getActions(): Promise<Action[]> {
        const list = (await this.adapter.list()).filter(name => name.indexOf(this.name + '.actions.') == 0).map(name => name.replace(this.name + '.actions.', '')) 
        return await Promise.all(list.map( name => this.getAction(name) ))
    }
}


export class Collection {
    public data: Document[]
    public storageAdapter: StorageAdapter
    public newActions: Action[]
    public storage: Storage
    public builder: Builder


    constructor(public name:string, options?:{ storageAdapter?: StorageAdapter}) {
        options = Object.assign({
            storageAdapter: Collection.defaultStorageAdapter(),
        }, options)

        this.data = []
        this.storageAdapter = options.storageAdapter
        this.newActions = []
        this.builder = new CollectionBuilder(this.data)
    }

    async initialize() {
        this.storage = await Storage.make('collections.' + this.name, this.storageAdapter)
        await this.refresh()
    }

    static async make(name: string, ...args:any[]) {
        const instance = new this(name, ...args)
        await instance.initialize()
        return instance
    }

    static defaultStorageAdapter(): StorageAdapter {
        return require('./Adapters/fsAdapter')
    }

    addAction(action) {
        action.timestamp = new Date().getTime()
        action.name = action.timestamp + '-' + uuid()
        action.value = JSON.stringify(action.value)
        this.newActions.push(action)
        this.builder.build([action])
        return this.save()
    }

    save() {
        const ret = this.storage.saveActions(this.newActions)
        this.newActions = []
        return ret
    }

    async refresh() {
        const actions = await this.storage.getActions()
        this.builder.build(actions)
        return true
    }

    async insert(value) {
        const id = uuid()
        const createdAt = new Date()
        const updatedAt = new Date()
        await this.addAction({ type: 'insert', value: { ...value, id, createdAt, updatedAt } })
        return this.find(id)
    }
    update(id, path, value) {
        return this.addAction({ type: 'update', id, path, value })
    }
    remove(id) {
        return this.addAction({ type: 'remove', id })
    }

    find(id) {
        return this.data.filter(item => item.id === id)[0]
    }

    get length() {
        return this.data.length
    }
}