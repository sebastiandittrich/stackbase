import { ID } from './Types';
import { Stackbase } from './Stackbase';
import { Document } from './Interfaces';
import { getPriority } from 'os';
import _ = require('lodash');


const uuid = require('uuid/v4')


export class Collection {

    constructor(public name:string, public database:Stackbase) {

    }

    insert(document:Document) {
        const id = uuid()
        const promises = []
        const date = new Date()
        const createdAt = date.getTime()
        const updatedAt = date.getTime()
        
        document = { ...document, id, createdAt, updatedAt }

        for(let key in document) {
            if(document.hasOwnProperty(key)) {

                promises.push( this.database.setProperty(this.name, id, key, document[key]) )

            }
        }

        return Promise.all(promises)
    }

    remove(id:ID) {
        return this.database.setProperty(this.name, id, 'deletedAt', new Date().getTime())
    }

    find(query:Object) {
        return this.database.collections[this.name].filter(_.matches(query))
    }

    findOne(query:Object) {
        return _.find(this.database.collections[this.name], query)
    }

    first() {
        return this.database.collection.
    }

}