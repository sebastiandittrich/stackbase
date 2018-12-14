import { StorageAdapter } from "../Interfaces";

const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)



export const fsAdapter = <StorageAdapter>{
    list(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir('storage/', (error, list) => {
                if(error) {
                    reject(error)
                } else {
                    resolve(list)
                }
            })
        })
    },
    async read(name: string): Promise<string> {
        return (await readFile('storage/' + name)).toString()
    },
    async write(name: string, content: string): Promise<boolean> {
        try {
            await writeFile('storage/' + name, content)
            return true
        } catch(error) {
            return false
        }
    }
}