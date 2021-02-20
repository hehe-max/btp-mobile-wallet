import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

import {Woma, Api, images, Wallets} from '../../../assets';

const {BTP} = Wallets;

const {Unmount, Language, Nav, Theme, Page, Loading, Modal, Emitter, Tools} = Woma;

export default class page_wallet_trading extends Component {
    #name = 'page_wallet_trading';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '交易';

    constructor(props) {
        super(props);
        const {route} = props;
        this.id = route.params.id;
        const selectWallet = new Wallets.Tools().getSelectWallet();
        this.privateKey = selectWallet.privateKey;
        this.address = selectWallet.address;
        this.token = new Wallets.Tools().getSelectWalletTokenById(this.id);
        const name = this.token.name.toLocaleUpperCase();
        this.title = `${name} ${this.#pageTitle}`;
        this.state = {
            address: ''
        };
    }

    componentDidMount() {
        this.#unmount.start();
        new Loading().show();
        this.getBalance();
        this.emitterTradingAddress = new Emitter().get('tradingAddress', res => {
            if (!this.#unmount.confirm(this.#name)) return;
            this.setState({address: res.address});
        });
    }

    componentWillUnmount() {
        this.#unmount.end();
        if (this.emitterTradingAddress) this.emitterTradingAddress.remove();
    }

    getBalance() {
        //根据地址获取金额
        new Wallets.BTP.Wallet().getBalanceAll(this.address).then(res => {
            new Loading().hide();
            this.setState({balanceAll: res});
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const state = this.state;
        return <Page.Render this={this}>
            <Page.Slide style={{padding: 15}}>
                <Page.Text text={'收款地址'} size={16} t={15}/>
                <View style={[css.listLineStyle, css.rowBetweenCenter, {paddingHorizontal: 0}]}>
                    <TextInput style={[css.inputStyle, {width: css.width - 110, flexGrow: 1}]} ref={'address'}
                               maxLength={100} value={state.address}
                               placeholder={'请输入钱包地址'} placeholderTextColor={css.font.minor}
                               onChangeText={val => this.setState({address: val})}/>
                    <View style={css.rowStartCenter}>
                        <Page.Icon name={'cardb'} r={10}/>
                        <Page.Icon name={'cardb'} onPress={() =>
                            new Nav().go('NotepadSelect', {emitter: 'tradingAddress', type: 'btp'})}/>
                    </View>
                </View>
                <Page.Text text={'转账金额'} size={16} t={15}/>
                <View style={[css.listLineStyle, {paddingHorizontal: 0}]}>
                    <TextInput style={[css.inputStyle]} ref={'amount'} maxLength={30}
                               placeholder={'请输入转账金额'} placeholderTextColor={css.font.minor}
                               onChangeText={val => this.setState({amount: val})}/>
                </View>
                <Page.Text text={'交易密码'} size={16} t={15}/>
                <View style={[css.listLineStyle, {paddingHorizontal: 0}]}>
                    <TextInput style={[css.inputStyle]} ref={'password'} maxLength={30}
                               password={true} secureTextEntry={true}
                               placeholder={'请输入交易密码'} placeholderTextColor={css.font.minor}
                               onChangeText={val => this.setState({password: val})}/>
                </View>
            </Page.Slide>
            <View style={{padding: 15}}>
                <Page.Text text={'确认转账'} style={css.btnStyle} onPress={() => {
                    new Page.Render().onBlur(this);
                    const TradingModal = new BTP.Trading({network: BTP.Config.network.testNet});
                    const maxCount = 500;
                    if (!state.address) return new Modal().alert('请输入收款地址');
                    if (!state.amount) return new Modal().alert('请输入转账金额');
                    if (!state.password) return new Modal().alert('请输入交易密码');
                    const privateKey = new Wallets.Tools().decrypt(this.privateKey, new Wallets.Tools().toMD5(state.password));
                    if (!privateKey) return new Modal().alert('密码输入错误');
                    // console.log('privateKey', privateKey);
                    //获取utxo
                    new BTP.Api().getUtxo(state.address, state.amount, 5).then(res => {
                        const {rs} = res;
                        const {outs, enough} = rs;
                        console.log(state.balanceAll);
                        if (!enough) return new Modal().alert(`余额不足。可用：${Tools.amount(state.balanceAll.usable)}，确认中：${Tools.amount(state.balanceAll.locked)}`);//余额不足
                        let utxo = TradingModal.getUseUTXO(outs, state.amount, maxCount);
                        if (utxo.list.length > maxCount) return new Modal().confirm(`最大可转金额：${utxo.amount}`, e => {
                            if (!new Modal().isOne(e)) return;
                            utxo = TradingModal.getUseUTXO(outs, state.amount);
                            next(utxo.list);
                        });
                        next(utxo.list);
                    });
                    //下一步
                    const next = (utxo) => {
                        const fees = TradingModal.getFees(utxo.length, state.feesRatio);
                        new Modal().confirm(`需要手续费：${fees} BTP`, res => {
                            if (new Modal().isOne(res)) tx(utxo, fees);
                        });
                    }
                    // //输入交易密码
                    // const txPassword = (utxo, fees) => {
                    //     new Modal().confirmPwd('请输入交易密码', res => {
                    //         console.log(res);
                    //         if (new Modal().isOne(res)) tx(utxo, fees);
                    //     })
                    // }
                    //交易
                    const tx = (utxo, fees) => {
                        new Loading().start('正在交易中');
                        TradingModal.getTxSign(privateKey, utxo, [{
                            addr: state.address,
                            value: state.amount
                        }], fees, index => {
                            console.log(`index:${index}`);
                            new Loading().next(index);
                        }).then(res => {
                            console.log(res);
                            new Loading().complete('交易成功', () => {
                                new Loading().hide();
                                new Emitter().set('wallet', true);
                                new Nav().popTpTop();
                            });
                        });
                    }
                }}/>
                <Page.Text text={'请务必保证设备在安全状态下，防止信息泄露。'} size={12} color={css.font.minor} lineHeight={24} t={10}/>
            </View>

        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.bg,
        flex: 1,
    },
});
