import { Builder } from './Builder'
import { ActionName, ID } from './Types';
import { Action, Document } from './Interfaces';

const _ = require('lodash')

export class CollectionBuilder extends Builder {
    public builtActions: ActionName[] = []

    build(actions:Action[]) {
        let actionsToBuild:Action[] = actions
            .filter(action => !this.builtActions.includes(action.name))
            .sort((a, b) => a.timestamp - b.timestamp)
        
        // const oldestActionToBuild = actionsToBuild[0]
        // const newestBuiltAction = this.builtActions.sort((a, b) => b.timestamp - a.timestamp)[0]

        // if(oldestActionToBuild.timestamp < newestBuiltAction.timestamp) {
        //     this.
        // }

        for(let action of actionsToBuild) {
            const value:any = action.value ? JSON.parse(action.value) : action.value

            if(action.type == "insert") {
                this.insert(value)
            } else if(action.type == 'remove') {
                this.remove(action.id)
            } else if(action.type == 'update') {
                this.update(action.id, action.path, value)
            }

            this.builtActions.push(action.name)
        }
    }

    get(...args:any[]):any {
        return _.get(this.state, ...args)
    }
    set(...args:any[]):any {
        return _.set(this.state, ...args)
    }
    unset(...args:any[]):any {
        return _.unset(this.state, ...args)
    }

    insert(value:Document) {
        this.state.push(value)
    }
    remove(id:ID) {
        const item = this.state.filter(item => item.id === id)[0]
        if(item != undefined) {
            this.state.splice(this.state.indexOf(item), 1)
        }
    }
    update(id:ID, path:string, value:any) {
        const item = this.state.filter(item => item.id === id)[0]
        if(item != undefined) {
            _.set(item, path, value)
        }
    }

}