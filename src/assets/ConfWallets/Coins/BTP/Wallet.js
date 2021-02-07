import MnemonicToPrivateKey from "../../Wallets/MnemonicToPrivateKey";
import Verify from "./Verify";
import Config from "./Config";
import Chain from './chain';
import Api from "./Api";

export default class Wallet {
    #_network = Config.network.mainNet;   //网络

    //公钥 hash160
    #getPublicKeyHash160 = (publicKey) => Chain.hash.hash160(Buffer.from(publicKey, 'hex'));
    //生成地址
    #getAddress = (publicKey) => Chain.address.toBase58Check(this.#getPublicKeyHash160(publicKey), this.#_network.pubKeyHashAddrId);

    constructor(params) {
        if (!params) params = {};
        if (params.network) this.#_network = params.network;
        if (params.log) this.log = params.log;
    }

    fromMnemonic(mnemonic, path = this.getPath()) {
        return new Promise((resolve, reject) => {
            //验证助记词
            const verifyMn = new Verify().mnemonic(mnemonic);
            if (verifyMn.code > 0) return reject(verifyMn);
            //生成seed钱包
            const seedWallet = new MnemonicToPrivateKey(mnemonic);
            if (this.log) console.log('BTP-fromMnemonic', seedWallet);
            return this.fromPrivateKey(seedWallet.privateKey).then(res => resolve(res));
        });
    }

    fromPrivateKey(privateKey) {
        return new Promise((resolve, reject) => {
            const keyPair = Chain.ec.fromPrivateKey(Buffer.from(privateKey, 'hex'), {network: this.#_network});
            const publicKey = keyPair.publicKey.toString('hex');
            const address = this.#getAddress(publicKey);
            const privateKeyWif = keyPair.toWIF();
            if (this.log) console.log('BTP-fromPrivateKey', {address, publicKey, privateKey, privateKeyWif});
            return resolve({
                address, publicKey,
                privateKey, privateKeyWif,
            })
        })
    }

    fromPrivateKeyWif(privateKeyWif) {
        return new Promise((resolve, reject) => {
            const keyPair = Chain.ec.fromWIF(privateKeyWif);
            const publicKey = keyPair.publicKey.toString('hex');
            const address = this.#getAddress(publicKey);
            const privateKey = keyPair.privateKey.toString('hex');
            return resolve({
                address, publicKey, privateKey, privateKeyWif
            })
        });
    }

    getPath(index = 0) {
        return `m/44'/0'/0'/0/${index}`;
    }

    /**
     * 数据请求
     */
    //获取金额
    getBalance(address) {
        return new Promise(resolve => {
            this.getBalanceAll(address).then(res => resolve(res.balance ?? 0))
        })
    }

    //获取金额
    getBalanceAll(address) {
        return new Promise(resolve => {
            new Api().getBalance(address).then(res => {
                console.log('btp-getBalance', res);
                if (res.code === 0) {
                    const {rs} = res;
                    return resolve({
                        balance: rs['balance'] ?? 0,
                        locked: rs['locked'] ?? 0,
                        usable: rs['usable'] ?? 0,
                    })
                }
            })
        })
    }

    /**
     * 查询交易记录
     * @param type      [0:all,1:in,2:out]
     * @param addr
     * @param size
     * @param p
     */
    getTransaction(type, addr, size, p) {
        return new Promise(resolve => {
            let list;
            if (type === 0) list = new Api().getTransactionAll(addr, size, p);
            else if (type === 1) list = new Api().getTransactionIn(addr, size, p);
            else if (type === 2) list = new Api().getTransactionOut(addr, size, p);
            list.then(res => {
                console.log('btp-getTransaction', res);
                const {rs, code} = res;
                let result = [];
                if (code === 0) {
                    rs.map((item, key) => {
                        const {header, vin, vout} = item;
                        result.push({
                            txid: header['txid'],
                            progress: header['progress'],
                            stat: header['stat'],
                            note: header['note'],
                            amount: header['change'],
                            fees: header['fees'],
                            addr: vout[0].address,
                            time: new Date(header['timestamp'] * 1e3).getTime(),
                            data: item,
                        })
                    });
                }
                return resolve(result);
            });
        })
    }
}
