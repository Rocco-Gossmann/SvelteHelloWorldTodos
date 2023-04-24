export function isObject(obj: unknown): obj is Object { 
    return typeof (obj) === 'object'
}

export function isArray(arr: unknown): arr is [] { 
    return arr instanceof Array
}
