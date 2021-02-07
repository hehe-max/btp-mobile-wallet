import Woma from '../../../ConfFramework';

const {Fetch} = Woma;
export default class Api {

    // #_host = '';     //本地
    #_host = 'http://47.241.109.12/wallet/api/';        //测试
    // #_host = '';          //正式

    //获取host
    #getHost = () => {
        return this.#_host;
    }

    constructor() {
    }

    //获取金额
    getBalance(address) {
        const url = `${this.#getHost()}v1/status/address?address={address}`;
        return new Fetch().get(url, {address});
    }

    //全部交易记录
    getTransactionAll(address, size, p) {
        const url = `${this.#getHost()}v1/list/address/transaction?address={address}&size={size}&page={p}`;
        return new Fetch().get(url, {address, size, p});
    }

    //转入交易记录
    getTransactionIn(address, size, p) {
        const url = `${this.#getHost()}v1/list/address/transaction/in?address={address}&size={size}&page={p}`;
        return new Fetch().get(url, {address, size, p});
    }

    //转出交易记录
    getTransactionOut(address, size, p) {
        const url = `${this.#getHost()}v1/list/address/transaction/out?address={address}&size={size}&page={p}`;
        return new Fetch().get(url, {address, size, p});
    }

}
