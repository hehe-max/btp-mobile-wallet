import {generateMnemonic, validateMnemonic} from 'react-native-bip39';
import conf from '../../Conf';
import Woma from '../../ConfFramework';
import BTP from '../Coins/BTP';

const crypto = require('react-native-crypto');
const {Language, Loading, Storage, Redux, Tools, System} = Woma;
export default class Wallets {
    #lang = new Language().all('chain_bank');

    /**
     * 生成参数Json
     * @param type          类型  [btp]
     * @param wallet        钱包  [mnemonic|privateKey|publicKey|privateKeyWif]
     * @param path          path
     * @param password      未加密的密码
     * @param name          钱包名称
     * @param tips          密码提示
     * @param token         token数组
     * @param isVerify      是否认证过，未认证需要认证后才可以发起交易
     * @param isMain        是否是主钱包
     * @constructor
     */
    #CreateParams = (type, wallet, path, password, name = '', tips = '', token, isVerify = false, isMain) => {
        if (!password) return console.warn(`创建钱包方法，CreateParams 接收参数password = ${password}`);
        password = this.toMD5(password);
        const params = {
            type: type,
            id: `${type}_${new Date().getTime()}`,
            name: isMain ? `${type.toLocaleUpperCase()}-Wallet` : name.toString(),
            tips,
            isMain,
            isVerify,
            token,
            address: wallet.address,
            time: [new Date().getTime()],//备份时间
        };
        //助记词
        if (wallet.mnemonic) params.mnemonic = this.encrypt(wallet.mnemonic, password);
        if (wallet.mnemonic) params.mnemonicCache = this.encrypt(wallet.mnemonic, conf.MnemonicCache);
        //私钥,Wif私钥
        if (wallet.privateKey) params.privateKey = this.encrypt(wallet.privateKey, password);
        if (wallet.privateKeyWif) params.privateKeyWif = this.encrypt(wallet.privateKeyWif, password);
        //公钥
        if (wallet.publicKey) params.publicKey = wallet.publicKey;
        //path
        if (path) params.path = path;
        return params;
    }
    /**
     *  BTP 创建钱包
     */
    #BTP_CreateMnemonic = (mnemonic, path, password, name, tips, isVerify = false, isMain = false) => new Promise(resolve => {
        return new BTP.Wallet({network: BTP.network.testNet, log: true}).fromMnemonic(mnemonic, path).then(wallet =>
            resolve(this.#CreateParams('btp', wallet, path, password, name, tips, new BTP.Config().params, isVerify, isMain)))
    });
    #BTP_CreatePrivateKey = (privateKey, path = undefined, password, name, tips, isVerify = false, isMain = false) => new Promise(resolve => {
        return new BTP.Wallet({network: BTP.network.testNet}).fromPrivateKey(privateKey).then(wallet =>
            resolve(this.#CreateParams('btp', wallet, path, password, name, tips, new BTP.Config().params, isVerify, isMain)))
    });
    #BTP_CreatePrivateKeyWif = (privateKeyWif, path = undefined, password, name, tips, isVerify = false, isMain = false) => new Promise(resolve => {
        return new BTP.Wallet({network: BTP.network.testNet}).fromPrivateKeyWif(privateKeyWif).then(wallet =>
            resolve(this.#CreateParams('btp', wallet, path, password, name, tips, new BTP.Config().params, isVerify, isMain)))
    });

    constructor() {
    }

    //随机生成地址
    randomMnemonic(strength = 128) {
        return new Promise((resolve, reject) => {
            generateMnemonic(strength).then(mnemonic => {
                if (!validateMnemonic(mnemonic)) return this.randomMnemonic(strength);
                return resolve(mnemonic);
            })
        })
    }

    //验证助记词
    verifyMnemonic(value) {
        return validateMnemonic(value);
    }

    //生成主钱包
    createMainWallets(mnemonic, password, tips, isVerify = false) {
        let wallets = {select: '', main: [], add: []};
        wallets.version = System.version;
        wallets.build = System.build;
        return new Promise((resolve, reject) => {
            new Loading().show(`生成 BTP`);
            setTimeout(() => {
                this.#BTP_CreateMnemonic(mnemonic, new BTP.Wallet().getPath(0), password, '', tips, isVerify, true).then(res => {
                    console.log('BTP', res);
                    wallets.main.push(res);
                    wallets.select = res.id;
                    return resolve(wallets);
                });
            }, 500);
        })
    }

    toMD5(value) {
        return crypto.createHash("md5").update(value.toString()).digest('hex');
    }

    /**
     * 加密
     * @param value
     * @param password
     * @returns {string}
     */
    encrypt(value, password) {
        let result = "";
        const cipher = crypto['createCipheriv']("aes-128-cbc", Buffer.from(password, "hex"), Buffer.from(this.toMD5("Wallet App"), "hex"));
        result += cipher.update(value.toString(), "utf8", "hex");
        result += cipher.final("hex");
        return result;
    }

    /**
     * 解密
     * @param value
     * @param password
     * @returns {string|boolean}
     */
    decrypt(value, password) {
        let result = "";
        try {
            const cipher = crypto['createDecipheriv']("aes-128-cbc", Buffer.from(password, "hex"), Buffer.from(this.toMD5("Wallet App"), "hex"));
            result += cipher.update(value.toString(), "hex", "utf8");
            result += cipher.final("utf8");
        } catch (e) {
            result = false;
        }
        return result;
    }

    /**
     *  钱包搜索
     */
    getWallet() {
        return new Redux().get(conf.AppWallets);
    }

    getWalletById(id) {
        const wallets = this.getWallet();
        let main = Tools.selectArrayByParams(wallets.main, 'id', id);
        let add = Tools.selectArrayByParams(wallets.add, 'id', id);
        if (main) return main;
        else return add;
    }

    getSelectWallet(wallets) {
        if (!wallets) wallets = this.getWallet();
        return this.getWalletById(wallets.select);
    }

    getSelectWalletTokenById(id) {
        const wallet = this.getSelectWallet();
        return Tools.selectArrayByParams(wallet.token, 'id', id);
    }

    getMainWallet(type) {
        return this.#getWalletByType('main', type);
    }

    getAddWallet(type) {
        return this.#getWalletByType('add', type);
    }

    getWalletMnemonic() {
        return new Redux().get(conf.AppWalletsMnemonic) ?? {}
    }

    //根据地址验证钱包是否存在
    isWalletExistByAddress(addr) {
        const wallets = this.getWallet();
        const main = wallets.main;
        const add = wallets.add;
        let isExist = false;
        if (main) isExist = main.find(m => m.address.toLocaleUpperCase() === addr.toLocaleUpperCase()) > 0;
        if (add) isExist = add.find(m => m.address.toLocaleUpperCase() === addr.toLocaleUpperCase()) > 0;
        return isExist;
    }

    //根据类型搜索钱包
    #getWalletByType = (type, value) => {
        let wallet = Tools.copy(this.getWallet()[type]);
        if (!value) return wallet;
        if (Tools.isArray(value)) {
            let arr = [];
            value.map((item) => {
                let list = Tools.selectArrayByArray(type, 'type', item);
                arr = arr.concat(list);
            });
            return arr;
        } else return Tools.selectArrayByArray(type, 'type', value);
    }

    /**
     *  钱包写入
     */
    setWallet(wallets) {
        new Redux().update(conf.AppWallets, wallets);
        new Storage().setJson(conf.AppWallets, wallets);
    }

    //临时存储
    setWalletTemporary(wallets) {
        new Redux().update(conf.AppWallets, wallets);
    }

    setWalletMnemonic(params) {
        new Redux().update(conf.AppWalletsMnemonic, params);
        new Storage().setJson(conf.AppWalletsMnemonic, params);
    }

    setWalletMnemonicMain(mnemonic) {
        mnemonic = this.encrypt(mnemonic, conf.MnemonicCache);
        let params = this.getWalletMnemonic();
        params.main = mnemonic;
        this.setWalletMnemonic(params);
    }

    setWalletMnemonicAdd(id, walletType, type, value) {
        value = this.encrypt(value, conf.MnemonicCache);
        let params = this.getWalletMnemonic();
        if (!params.add) params.add = [];
        params.add.push({
            id,
            walletType,
            type,//1:助记词，2：私钥，3：WIF私钥
            value,
        });
        this.setWalletMnemonic(params);
    }

    /**
     * 钱包删除
     */


    removeWalletAll() {
        this.setWallet({});
    }

    //根据id删除Add钱包中数据
    removeWalletAddById(id) {
        const wallets = this.getWallet();
        const add = wallets.add;
        const selectId = wallets.select;
        let i = 0;
        if (add) {
            add.map((item, key) => {
                if (item.id === id) i = key;
            });
            add.splice(i, 1);
            if (selectId === id) wallets.select = wallets.main[0].id;
        }
        this.setWallet(wallets);
    }

    removeWalletMnemonicAll() {
        this.setWalletMnemonic({});
    }

    removeWalletMnemonicAddById(id) {
        let params = this.getWalletMnemonic();
        if (!params.add) params.add = [];
        params.add.map((item, key) => {
            if (item.id === id) params.add.splice(key, 1);
        });
        this.setWalletMnemonic(params);
    }
}
