import {mnemonicToSeed} from 'react-native-bip39';
import {fromSeed} from 'bip32';


export default class MnemonicToPrivateKey {
    constructor(mnemonic, path) {
        const seed = mnemonicToSeed(mnemonic);
        let root = fromSeed(seed);
        if (path) root = root.derivePath(path);
        const privateKey = root.privateKey.toString('hex');
        const publicKey = root.publicKey.toString('hex');
        console.log(path, privateKey);
        return {
            privateKey,
            publicKey,
        };
    }
}
