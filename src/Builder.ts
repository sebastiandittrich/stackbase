import { Action, Document } from "./Interfaces";

export abstract class Builder {
    constructor(public state:Document[]) {

    }
    abstract build(actions:Action[]): void
}