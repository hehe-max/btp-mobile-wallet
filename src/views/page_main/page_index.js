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
                new Nav().go(`WalletList_${selectWallet.type.toLocaleUpperCase()}`, {id: item.id})}>
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
            <Page.Header style={{borderBottomWidth: 0}}
                         left={<Page.Text text={'钱包'} size={20} l={15}/>}
                         right={<View style={css.rowStartCenter}>
                             <Page.Icon name={'jia2'} size={22} r={15}/>
                             <Page.Icon name={'saoma2'} size={22} r={15}/>
                         </View>}/>
            <ImageBackground source={images[`wallet_${selectWallet.type.toLocaleLowerCase()}`]}
                             style={[css.colBetween, styles.imageBg]}
                             imageStyle={{resizeMode: 'stretch'}}>
                <View>
                    <View style={css.rowBetweenCenter}>
                        <Page.Text text={selectWallet.name} size={20} color={css.font.white}/>
                        <Page.Icon name={'guanli'} color={css.font.white}/>
                    </View>
                    <Page.Text text={Tools.cutString(selectWallet.address, 15)} t={10} lineHeight={24}
                               color={css.font.white}/>
                </View>
                <View>
                    <View style={css.rowStart}>
                        <Page.Icon name={'ico'} size={26} color={css.font.white}/>
                        <Page.Text text={'收款码'} lineHeight={34} size={16} l={10} color={css.font.white}/>
                    </View>
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
        height: (css.width - 30) * 0.43,
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
