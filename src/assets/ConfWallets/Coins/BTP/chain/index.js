
const _OPS = require('./ops/ops.json')
module.exports = {
    types: require('./types'),
    typecheck: require('./typecheck'),
    hash: require('./hash'),
    ec: require('./ec'),
    qitmeer58check: require('./qitmeer58check'),
    address: require('./address'),
    networks: require('./networks'),
    tx: require('./transaction'),
    txsign: require('./txsign'),
    // block: require('./block'),
    OPS: _OPS,
    OPS_MAP: require('./ops/map'),
    script: require('./script'),
    signature: require('./signature')
}
