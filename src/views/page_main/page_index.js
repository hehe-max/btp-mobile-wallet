import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

import {Woma, conf, Api, images, Wallets,} from '../../assets';
import {Image} from "react-native-svg";

const {Unmount, Language, Redux, Nav, Theme, Page, Tools, Popup} = Woma;


export default class page_main extends Component {
    #name = 'page_main';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '首页';

    constructor(props) {
        super(props);
        const {route} = props;
        this.title = `${this.#pageTitle}`;
        this.state = {
            wallets: new Wallets.Tools().getWallet(),
        };
    }

    componentDidMount() {
        this.#unmount.start();
        new Redux().listen(conf.AppWallets, () => {
            if (!this.#unmount.confirm()) return false;
            const wallets = new Wallets.Tools().getWallet();
            if (!wallets.version) return;
            this.setState({wallets: new Wallets.Tools().getWallet()});
        });
        this.getBalance();
        this.intervalBalance = setInterval(() => this.getBalance(), 60000);
    }

    componentWillUnmount() {
        this.#unmount.end();
        if (this.intervalBalance) clearInterval(this.intervalBalance);
    }

    getBalance() {
        const wallets = this.state.wallets;
        const selectWallet = new Wallets.Tools().getSelectWallet(wallets);
        const token = selectWallet.token;
        token.map((item) => {
            new Wallets.BTP.Wallet().getBalance(selectWallet.address).then(balance => {
                item.amount = balance;
                new Wallets.Tools().setWallet(wallets);
            });
        });
    }

    itemView() {
        const css = this.#css,
            styles = this.#styles;
        const wallets = this.state.wallets;
        const selectWallet = new Wallets.Tools().getSelectWallet(wallets);
        const token = selectWallet.token;
        return token.map((item, key) => {
            let icon = <Page.Text text={Tools.getFromFirst(item.name).toLocaleUpperCase()} style={styles.icon}/>;
            if (images[`logo_${item.name}`]) icon = <Image source={images[`logo_${item.name}`]} style={styles.icon}/>;
            return <Page.Text key={key} onPress={() =>
                new Nav().go( `WalletList_${selectWallet.type.toLocaleUpperCase()}`, {id: item.id})}>
                <View style={[css.listRadiusStyle, css.rowBetweenCenter]}>
                    <View style={css.rowStartCenter}>
                        {icon}
                        <Page.Text text={item.name.toLocaleUpperCase()} l={15}/>
                    </View>
                    <Page.Text text={Tools.amount(item.amount ?? 0)}/>
                </View>
            </Page.Text>
        })
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const wallets = this.state.wallets;
        const selectWallet = new Wallets.Tools().getSelectWallet(wallets);
        return <Page.Render this={this} isHeader={false} innerStyle={css.colStart}>
            <Page.Header left={<Page.Text text={'钱包'} size={18} l={15}/>}
                         right={<View style={css.rowStartCenter}>
                             <Page.Icon name={'cardb'} size={20} r={15} onPress={() => {
                                 // new Popup().select([
                                 //     {text: 'PMEER', type: 'pmeer'},
                                 //     {text: 'TRX', type: 'trx'}
                                 // ], res => {
                                 //     console.log('res', res);
                                 // }, {title: '请选择'});
                             }}/>
                             <Page.Icon name={'cardb'} size={20} r={15}/>
                         </View>}/>
            <ImageBackground source={images[`wallet_${selectWallet.type.toLocaleLowerCase()}`]}
                             style={[css.colBetween, styles.imageBg]}
                             imageStyle={{resizeMode: 'stretch'}}>
                <View>
                    <Page.Text style={[css.rowEndCenter]} onPress={() => {
                        new Page().Clipboard(selectWallet.address);
                    }}>
                        <Page.Text text={Tools.cutString(selectWallet.address)} size={16}/>
                        <Page.Icon name={'cardb'} l={15}/>
                    </Page.Text>
                    <Page.Text text={'我的地址'} style={{textAlign: 'right'}} size={16} lineHeight={40}/>
                </View>
                <View style={css.rowBetweenCenter}>
                    <Page.Text text={selectWallet.name} size={18}/>
                    <Page.Icon name={'cardb'} size={20} onPress={() => new Nav().go( 'QrCode', {
                        id: selectWallet.token[0].id,
                    })}/>
                </View>
            </ImageBackground>
            <Page.Slide style={[css.innerRadius, {marginTop: 20, padding: 15}]} onRefresh={() => {
                this.getBalance();
            }}>
                {this.itemView()}
            </Page.Slide>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    imageBg: {
        width: css.width - 30,
        height: (css.width - 30) * 0.335,
        marginHorizontal: 15,
        padding: 15
    },
    icon: {
        width: 36,
        height: 36,
        lineHeight: 36,
        backgroundColor: css.page.bg,
        borderRadius: 18,
        textAlign: 'center',
    }
});
