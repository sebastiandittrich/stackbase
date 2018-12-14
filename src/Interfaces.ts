import { ID } from "./Types";

export interface Action {
    type: string
    timestamp?: number
    name?: string
    value?: string
    id?: string
    path?: string
}

export interface Document {
    id: ID
    [key:string]: any
}

export interface StorageAdapter {
    read(name: string): Promise<string>,
    write(name: string, content: string): Promise<boolean>,
    list(): Promise<string[]>
}