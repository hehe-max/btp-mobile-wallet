import {validateMnemonic} from 'react-native-bip39';

/**
 *  错误代码
 *  10~19：地址
 *      10：没有地址
 *      11：地址错误
 *
 *  20~29：金额
 *      20：没有金额
 *      21：余额不足
 *      22：手续费不足
 *      23：金额错误
 *
 *  30~39：交易
 *      30：交易失败
 *      31：交易过大
 *      32：交易暂停
 *
 *  40~49: 创建钱包
 *      40：path 不正确
 *      41：助记词错误
 *      42：私钥错误
 *
 *  100 ：报错
 */
export default class Verify {
    constructor() {
    }

    mnemonic(value) {
        const result = {code: 0};
        if (!validateMnemonic(value)) {
            result.code = 41;
            result.msg = '助记词错误';
            console.warn(`BTP 助记词有误 ${value}`);
        }
        return result;
    }

    privateKey(value) {
        const result = {code: 0};
        if (typeof value !== 'string' || value.length !== 64) {
            result.code = 42;
            result.msg = '助记词错误';
            console.warn(`BTP 私钥有误 ${value}`);
        }
        return result;
    }
}
