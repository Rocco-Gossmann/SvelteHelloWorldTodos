export function isObject(obj: unknown): obj is Object { 
    return typeof (obj) === 'object'
}

export function isArray(arr: unknown): arr is [] { 
    return arr instanceof Array
}

export function isArrayEqual(arr1: Array<any>, arr2: Array<any>) {

    if(!(arr1 instanceof Array && arr2 instanceof Array))
        return false;

    if(arr1.length != arr2.length) return false;

    if(arr1.filter( (e, i) => { 
        if(e instanceof Array && arr2[i] instanceof Array)
            return !isArrayEqual(e, arr2[i]);
        else 
            return !(e === arr2[i]); 
    }).length) return false;

    return true;
}
