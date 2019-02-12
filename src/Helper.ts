import _ = require("lodash");

export function set(object:Object, path:string, value:any) {
    return _.set(object, path, value)
}

export function get(object:Object, path:string) {
    return _.get(object, path)
}

export function splitPath(path:string) {
    const result = path.match(/(.+)\[(.+)\].(.+)/) || []

    return {
        collection: result[1],
        key: result[2],
        property: result[3],
    }
}

// export function pathDepth(path:string) {
//     return splitPath(path).length
// }

// export function sortByDepth(array:string[]) {
//     return array.sort((a, b) => pathDepth(a) - pathDepth(b))
// }
