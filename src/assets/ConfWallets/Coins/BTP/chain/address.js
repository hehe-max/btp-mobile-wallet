
const Buffer = require('safe-buffer').Buffer
const qitmeer58check = require('./qitmeer58check').default
const Network = require('./networks')
const Script = require('./script')
const types = require('./types')
const typecheck = require('./typecheck')

module.exports = {
    fromBase58Check: fromBase58Check,
    toBase58Check: toBase58Check,
    toOutputScript: toOutputScript
}

function fromBase58Check (address) {
    const payload = qitmeer58check.decode(address)
    if (payload.length < 22) throw new TypeError(address + ' is too short')
    if (payload.length > 22) throw new TypeError(address + ' is too long')

    const version = payload.readUInt16BE(0)
    const hash = payload.slice(2)

    return { version: version, hash: hash }
}

function toBase58Check (hash, version) {
    typecheck(types.Hash160, hash)
    const payload = Buffer.allocUnsafe(22)
    payload.writeUInt16BE(version, 0)
    hash.copy(payload, 2)
    return qitmeer58check.encode(payload)
}

function toOutputScript (address, network) {
    network = network || Network.privnet
    const decode = fromBase58Check(address)
    if (decode) {
        if ( decode.version === network.pubKeyHashAddrId ) return Script.Output.P2PKH(decode.hash)
        if ( decode.version === network.ScriptHashAddrID ) return Script.Output.P2SH(decode.hash)
        throw Error('Unknown version ' + decode.version)
    }
    throw Error('fail to base58check decode ' + address)
}
