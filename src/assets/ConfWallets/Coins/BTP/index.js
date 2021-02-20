import Config from './Config';
import Wallet from './Wallet';
import Trading from './Trading';
import Api from './Api';
import Verify from "./Verify";

export default {
    Config,
    network: Config.network,
    getPath: new Wallet().getPath,

    Wallet,
    Trading,
    Api,
    Verify,
};
