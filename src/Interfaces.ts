import { ID, ActionName, Property } from "./Types";

export interface Action {
    type: string
    timestamp?: number
    name?: ActionName
    value?: string
    id?: string
    path?: string
}

export interface Collection extends Array<Document> {
    [index: number]: Document
}

export interface Document {
    id?: ID
    [key:string]: Property
}

export interface StorageAdapter {
    read(name: string): Promise<string>,
    write(name: string, content: string): Promise<boolean>,
    list(): Promise<string[]>
}