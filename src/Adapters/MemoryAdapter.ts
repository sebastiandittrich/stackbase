import { StorageAdapter } from '../Interfaces';

const memory: { [key: string]: string } = {}

export const MemoryAdapter = <StorageAdapter>{
    async list(): Promise<string[]> {
        return Object.keys(memory)
    },
    async read(name: string): Promise<string> {
        return memory[name]
    },
    async write(name: string, content: string): Promise<boolean> {
        memory[name] = content
        return true
    }
}