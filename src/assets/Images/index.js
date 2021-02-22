const _host = './';
const _hostAvatar = './avatar/';
const _hostWallet = './wallet/';
const _hostNav = './nav/';


let images = {
    nav_wallet: require(`${_hostNav}nav_wallet.png`),
    nav_wallet_select: require(`${_hostNav}nav_wallet_select.png`),
    nav_center: require(`${_hostNav}nav_center.png`),
    nav_center_select: require(`${_hostNav}nav_center_select.png`),

    avatar_0: require(`${_host}avatar.png`),
    avatar_1: require(`${_hostAvatar}1.png`),
    avatar_2: require(`${_hostAvatar}2.png`),
    avatar_3: require(`${_hostAvatar}3.png`),
    avatar_4: require(`${_hostAvatar}4.png`),
    avatar_5: require(`${_hostAvatar}5.png`),
    avatar_6: require(`${_hostAvatar}6.png`),
    avatar_7: require(`${_hostAvatar}7.png`),
    avatar_8: require(`${_hostAvatar}8.png`),

    wallet_btp: require(`${_hostWallet}wallet_btp.png`),
    wallet_eth: require(`${_hostWallet}wallet_eth.png`),
    wallet_pmeer: require(`${_hostWallet}wallet_pmeer.png`),
    wallet_btc: require(`${_hostWallet}wallet_btc.png`),
    wallet_trx: require(`${_hostWallet}wallet_trx.png`),


    start_bg_1: require(`${_host}start_bg_1.png`),

    wallet_list_bg: require(`${_host}wallet_list_bg.png`),

    wallet_qrcode_bg: require(`${_host}wallet_qrcode_bg.png`),
    wallet_qrcode_scan: require(`${_host}wallet_qrcode_scan.png`),

    wallet_detail_ok: require(`${_host}wallet_detail_ok.png`),
    wallet_detail_fail: require(`${_host}wallet_detail_fail.png`),
    wallet_detail_ongoing: require(`${_host}wallet_detail_ongoing.png`),
    wallet_detail_unconfirmed: require(`${_host}wallet_detail_unconfirmed.png`),


    center_exit: require(`${_host}center_exit.png`),
};


export default images
