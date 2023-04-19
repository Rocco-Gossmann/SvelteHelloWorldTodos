
export default interface IEncryptable {

    lock(key: CryptoKey): Promise<this>
    unlock(key: CryptoKey): Promise<this>

    isLocked(): boolean

}
