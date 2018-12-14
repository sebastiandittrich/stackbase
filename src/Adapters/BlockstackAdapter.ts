import { StorageAdapter } from '../Interfaces'

var blockstack = blockstack

export const BlockstackAdapter = <StorageAdapter> {
    async list(): Promise<string[]> {
        let files: string[] = []
        await blockstack.listFiles((file:string) => {
            files.push(file)
            return true
        })
        return files
    },
    read(name:string): Promise<string> {
        return blockstack.getFile(name)
    },
    async write(name:string, content:string): Promise<boolean> {
        try {
            await blockstack.putFile(name, content)
            return true
        } catch(error) {
            return false
        }
    }
}