/**
 * Converts any string into a Uint8ArrayBuffer
 * @param {string} str - the string to covert
 * @returns {Uint8Array} 
 */
export function Str2Buffer( str ) {
    return (new TextEncoder()).encode(str);
}


/**
 * Converts a IInt8Array to string
 *
 * @param {Uint8Array} buffer
 * @returns {string} 
 */
export function Buffer2Str( buffer ) {
    return (new TextDecoder()).decode(buffer);

}

/**
 * Adds data at the beginning of a TypedArray
 *
 * @param {TypedArray} origBuffer - the Array to which to add the data
 * @param {origBuffer.constructor} newData - the new data to add
 *
 * @throws {Error} - if origBuffer is ot a TypedArray 
 */
export function BufferPrepend(origBuffer, newData) {
    if(!ArrayBuffer.isView(origBuffer))
        throw new Error("origBuffer must be an instance of TypedArray");

    if(!(newData instanceof origBuffer.constructor))
        throw new Error("new data must be of same type as origBuffer ", origBuffer, newData);
    
    const ret = new (origBuffer.constructor)(origBuffer.length + newData.length);
    ret.set(newData, 0)
    ret.set(origBuffer, newData.length);

    return ret;
}




export default {
    Str2Buffer, Buffer2Str, BufferPrepend
}
