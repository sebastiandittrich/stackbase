import { StorageAdapter } from "./Interfaces";
import { splitPath } from "./Helper";
import _ = require("lodash");

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

    getPath(collection?:string, key?:string, property?:string) {
        let path = this.name + ':'
        if(collection) {
            path += collection

            if(key) {
                path += '[' + key + ']'

                if(property) {
                    path += '.' + property
                }
            }
        }
        return path
    }

    async listFiles(...args) {
        const list = await this.adapter.list()
        return list
            .filter(filename => filename.indexOf(this.getPath(...args)) == 0)
            .map(filename => filename.replace(this.getPath(), ''))
    }

    async getFile(collection:string, key:string, property:string) {
        try {
            return JSON.parse(await this.adapter.read(this.getPath(collection, key, property)))
        } catch(error) {
            return undefined
        }
    }

    set(collection:string, key:string, property:string, value:any) {
        return this.adapter.write(this.getPath(collection, key, property), JSON.stringify(value))
    }
}