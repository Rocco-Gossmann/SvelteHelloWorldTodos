export function sha256(data: string): Promise<ArrayBuffer> {
    return crypto.subtle.digest(
        "SHA-256",  
        (new TextEncoder()).encode(data)
    );
}

function importSyncKey(passhash: ArrayBuffer) {
    return crypto.subtle.importKey("raw",
        passhash, "AES-GCM",
        false, ['encrypt', 'decrypt'])
}

export class EncryptedData {
    data: Uint8Array
    iv: Uint8Array

    static fromBase64(base64: string) {
        return EncryptedData.fromUint8Array(new Uint8Array(base64_decrypt(base64||"")));
    }

    static fromUint8Array(arr: Uint8Array) { 
        if(arr.length < 32) throw new Error("the given array does not seem to contain encrypted data (min length: 32)")
        const iv = new Uint8Array(16);
        const data = new Uint8Array(arr.length - 16);
        for (let a = 0; a < 16; a++) {
            iv[a] = arr[a];
        }

        for (let a = 16,b = 0; a < arr.length; a++,b++) { 
            data[b] = arr[a]; 
        }

        return new EncryptedData({ iv, data });
    }

    constructor(payload: Partial<EncryptedData>) {
        this.data = payload.data;
        this.iv = payload.iv;
    }

    toUint8Array() {
        const ivLen = this.iv.length;
        const dataLen = this.data.length;
        const out = new Uint8Array(ivLen + dataLen);

        for (let a = 0; a < ivLen; a++) {
            out[a] = this.iv[a];
        }
        for (let a = 0, b=ivLen; a < dataLen; a++,b++) {
            out[b] = this.data[a];
        }

        return out;
    }

    toBase64() { 
        return base64_encrypt(this.toUint8Array());
    }
}

export async function synckey_encrypt(data: ArrayBuffer, pass: string): Promise<EncryptedData> { 
    const key = await importSyncKey(await sha256(pass))
    const iv = new Uint8Array(16);
    await crypto.getRandomValues(iv);

    return new EncryptedData({
        iv, 
        data: new Uint8Array(await crypto.subtle.encrypt({
            name: "AES-GCM",
            length: 2048,
            iv
        }, key, data))
    })
}

export async function synckey_decrypt(data: EncryptedData, pass: string): Promise<ArrayBuffer> { 
    if (!data) return undefined;
    const key = await importSyncKey(await sha256(pass))
    return await crypto.subtle.decrypt({
        name: "AES-GCM",
        length: 2048,
        iv: data.iv
    }, key, data.data)
}

export function base64_encrypt(buffer: ArrayBuffer): string {
    if (typeof(Buffer) !== "undefined") {
        return Buffer.from(buffer).toString("base64")
    }
    else { 
        let str = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let a = 0; a < len; a++) {
            str += String.fromCharCode(bytes[a])
        }
        return btoa(str)
    }
}

export function base64_decrypt(base64: string): ArrayBuffer {
    if (typeof(Buffer) !== "undefined") {
        return Buffer.from(base64, 'base64');
    }
    else {
        const str = atob(base64);
        const len = str.length;
        const bytes = new Uint8Array(len);

        for (let a = 0; a < len; a++) {
            bytes[a] = str.charCodeAt(a);
        }

        return bytes.buffer;
    }
}

interface ISyncKey {
    encrypt: (data: ArrayBuffer, pass: string) => Promise<EncryptedData>
    decrypt: (data: EncryptedData, pass: string) => Promise<ArrayBuffer>
}

interface IBase64 {
    encrypt: (data: ArrayBuffer) => string
    decrypt: (data: string) => ArrayBuffer
}

interface CryptoGraphyExport {
    sha256: (data: string) => Promise<ArrayBuffer>

    synckey: ISyncKey

    base64: IBase64
}

export const cryptography: CryptoGraphyExport = {
    sha256,
    synckey: {
        encrypt: synckey_encrypt,
        decrypt: synckey_decrypt
    },
    base64: {
        encrypt: base64_encrypt,
        decrypt: base64_decrypt
    }
}

export default cryptography; 