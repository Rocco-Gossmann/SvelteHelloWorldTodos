/**
 * Converts any string into a Uint8ArrayBuffer
 * @param {string} str - the string to covert
 * @returns {Uint8Array} 
 */
function Str2Buffer( str ) {
    return (new TextEncoder()).encode(str);
}


/**
 * Converts a IInt8Array to string
 *
 * @param {Uint8Array} buffer
 * @returns {string} 
 */
function Buffer2Str( buffer ) {
    return (new TextDecoder()).decode(buffer);
}
