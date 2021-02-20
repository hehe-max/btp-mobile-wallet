import Chain from './chain';
import Api from "./Api";
import Config from "./Config";
import Wallet from "./Wallet";
import D from 'bignumber.js';

export default class Trading {
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


    /**
     * 获取手续费
     * 公式   ((vin - 1) * 1500 + 2000 + vout  * 350）* 系数
     * @param utxoLength        utxo 长度
     * @param feesRate          手续费参数选择
     * @returns {number}
     */
    getFees(utxoLength = 0, feesRate = 2) {
        let fees = 0;
        const feesRateValue = Config.feesRatio[feesRate];
        const one = new D(utxoLength - 1).multipliedBy(1500).toNumber();
        const two = new D(utxoLength + 1).multipliedBy(350).toNumber();
        fees = new D(one).plus(2000).plus(two).toNumber();
        fees = new D(fees).multipliedBy(feesRateValue).toNumber();
        fees = new D(fees).dividedBy(1e8).toNumber();
        console.log('getFees', fees);
        return fees;
    }

    /**
     * 获取应该使用的utxo
     * @param utxo          utxo list
     * @param amount        交易金额
     * @param maxCount      最大count 默认 undefined
     * @returns {{}}
     */
    getUseUTXO(utxo, amount, maxCount) {
        let utxoAmount = 0, utxoList = [];
        for (let i = 0, len = utxo.length; i < len; i++) {
            if (maxCount && i > maxCount) continue;
            if (utxoAmount > amount) continue;
            utxoAmount = new D(utxoAmount).plus(utxo[i].amount).toNumber();
            utxoList.push(utxo[i]);
        }
        return {
            amount: utxoAmount,
            list: utxoList,
        };
    }

    /**
     * 获取交易签名
     * @param privatekey
     * @param utxo
     * @param toParams
     * @param fees
     * @param note
     * @param progressSuccess
     * @returns {Promise<*>}
     */
    getTxSign(privatekey, utxo, toParams, fees, note = '', progressSuccess) {
        const keyPair = Chain.ec.fromPrivateKey(Buffer.from(privatekey, 'hex'), {network: this.#_network});
        const publicKey = keyPair.publicKey.toString('hex');
        const address = this.#getAddress(publicKey);
        return new Promise((resolve, reject) => {
            const txBuilder = new Chain.txsign.newSigner(this.#_network);
            txBuilder.setVersion(1);
            txBuilder.setTimestamp(Math.ceil(new Date().getTime() / 1000));
            let balanceTotal = 0;   //输出总金额
            let utxoTotal = 0;      //使用utxo总金额
            let useUTXO = [];       //已使用的UTXO

            //计算输出总金额
            for (let i = 0, len = toParams.length; i < len; i++) {
                balanceTotal = new D(toParams[i].value).plus(balanceTotal).toNumber();
            }
            //输出总金额 + 手续费
            let balanceTotalAll = new D(balanceTotal).plus(fees).toNumber();
            balanceTotalAll = new D(balanceTotalAll).multipliedBy(1e8).toNumber();
            for (let i = 0, len = utxo.length; i < len; i++) {
                if (utxoTotal > balanceTotalAll) continue;
                useUTXO.push(utxo[i]);
                utxoTotal = new D(utxo[i].amount).multipliedBy(1e8).plus(utxoTotal).toNumber();
                txBuilder.addInput(utxo[i]['txid'], utxo[i]['number']);
            }
            if (balanceTotal > utxoTotal) return reject({code: 21});            //余额不足
            if (balanceTotalAll > utxoTotal) return reject({code: 22});         //手续费不足
            const backBalance = new D(utxoTotal).minus(balanceTotalAll).toNumber();     //找回金额
            //处理多笔交易
            toParams.map((item) => {
                txBuilder.addOutput(item.addr, new D(item.value).multipliedBy(1e8).toNumber());
            });
            txBuilder.addOutput(address, backBalance);

            let progressParams = {
                value: 0,
                record: 0,
                ratio: 5,
            };
            for (let i = 0, len = useUTXO.length; i < len; i++) {
                const setTimeSign = setTimeout(() => {
                    progressParams.value = ((i + 1) / len * 100).toFixed(2);
                    if (progressParams.record + progressParams.ratio <= progressParams.value) {
                        progressParams.record = progressParams.value;
                        if (typeof progressSuccess === "function") progressSuccess(progressParams.value);
                    }
                    txBuilder.sign(i, keyPair);
                    clearTimeout(setTimeSign);
                    if (useUTXO.length === (i + 1)) return resolve(txBuilder);
                }, 10);
            }
        }).then(res => {
            const tx = res.build().toBuffer().toString('hex');
            console.log(tx);
            return new Promise((resolve, reject) => {
                new Api().postTx(tx, address, note).then(res => {
                    console.log(res);
                    const {code, msg, rs} = res;
                    if (code === 0) return resolve(rs);
                    if (res.code === 65793) return reject({code: 30});//交易失败
                    if (res.code === 131586) return reject({code: 31});//交易过大
                    if (res.code === 1048577) return reject({code: 32, msg: res.msg});//交易暂停
                })
            })
        })
    }
}
