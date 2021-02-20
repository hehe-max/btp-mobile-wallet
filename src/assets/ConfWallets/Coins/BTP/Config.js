import chain from './chain';

export default class Config {
    constructor() {
    }

    //网络
    static network = {
        mainNet: chain.networks.mainnet,//主网
        testNet: chain.networks.testnet,//测试网
    }

    //手续费比例
    static feesRatio = {
        1: 50,
        2: 20,
        3: 3
    }

    //初始化参数
    params = [
        {id: 'btp_1', name: 'btp', decimals: 8, contract: {}},
    ]
}
