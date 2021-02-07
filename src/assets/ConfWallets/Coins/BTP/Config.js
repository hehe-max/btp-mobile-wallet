import chain from './chain';

export default class Config {
    constructor() {
    }

    static network = {
        mainNet: chain.networks.mainnet,//主网
        testNet: chain.networks.testnet,//测试网
    }

    params = [
        {id: 'btp_1', name: 'btp', decimals: 8, contract: {}},
    ]
}
