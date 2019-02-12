import { StorageAdapter, Collection as CollectionInterface, Document } from "./Interfaces";
import { Storage } from './Storage'
import * as Helper from './Helper'
import _ = require("lodash");
import { Property } from "./Types";
import { Collection } from "./Collection";

export class Stackbase {
    public collections: { [key: string]: CollectionInterface }
    public storageAdapter: StorageAdapter
    public storage: Storage

    constructor(public name:string, options?:{ storageAdapter?: StorageAdapter }) {
        options = Object.assign({
            storageAdapter: this.defaultStorageAdapter(),
        }, options)

        this.collections = {}
        this.storageAdapter = options.storageAdapter
    }

    async initialize(): Promise<void> {
        this.storage = await Storage.make('stackbase.' + this.name, this.storageAdapter)
        await this.refresh()
    }

    static async make(name: string, ...args:any[]): Promise<Stackbase> {
        const instance = new this(name, ...args)
        await instance.initialize()
        return instance
    }

    defaultStorageAdapter() {
        return require('./Adapters/fsAdapter').fsAdapter
    }

    async refresh() {
        const collections = await this.listCollections()

        for(let collectionname of collections) {
            const collection = await this.getCollection(collectionname)
            
            this.collections[collectionname] = collection
        }
    }

    Collection(name: string) {
        return new Collection(name, this)
    }

    async listCollections() {
        const collections = (await this.storage.listFiles()).map(filename => Helper.splitPath(filename).collection)
        
        return _.flow([_.compact, _.uniq])(collections)
    }

    async listEntries(collection:string) {
        const entries = (await this.storage.listFiles(collection)).map(filename => Helper.splitPath(filename).key)

        return _.uniq(entries)
    }

    async listProperties(collection:string, key:string) {
        const properties = (await this.storage.listFiles(collection, key)).map(filename => Helper.splitPath(filename).property)

        return _.uniq(properties)
    }

    async getCollection(collectionname: string) {
        const collection: CollectionInterface = []
        const entrykeys = (await this.listEntries(collectionname))

        for(let key of entrykeys) {
            collection.push(await this.getDocument(collectionname, key))
        }

        return collection
    }

    async getDocument(collection: string, key:string) {
        const document: Document = {}
        const properties = await this.listProperties(collection, key)

        for(let property of properties) {
            document[property] = await this.getProperty(collection, key, property)
        }

        return document
    }

    async getProperty(collection:string, key:string, property:string) {
        return <Property>(await this.storage.getFile(collection, key, property)).value
    }

    setProperty(collection:string, key:string, property:string, value:any) {
        return this.storage.set(collection, key, property, {value, timestamp: new Date().getTime()})
    }
}