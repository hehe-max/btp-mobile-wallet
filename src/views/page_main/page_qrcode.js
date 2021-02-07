import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

import {Woma, Api, images, Wallets} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools} = Woma;

export default class page_qrcode extends Component {
    #name = 'page_qrcode';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '二维码';

    constructor(props) {
        super(props);
        const {route} = props;
        this.id = route.params.id;
        this.selectWallet = new Wallets.Tools().getSelectWallet();
        this.address = this.selectWallet.address;
        this.token = new Wallets.Tools().getSelectWalletTokenById(this.id);
        const name = this.token.name.toLocaleUpperCase();
        this.title = `${name} ${this.#pageTitle}`;
        this.state = {};
    }

    componentDidMount() {
        this.#unmount.start();
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Render this={this} innerStyle={css.colAround}>
            <ImageBackground imageStyle={{resizeMode: 'stretch'}}
                             source={images.wallet_qrcode_bg}
                             style={styles.imageBg}>
                <View style={[css.colBetweenCenter, {flex: 1, paddingVertical: 15}]}>
                    <View style={[styles.scanView]}>
                        <ImageBackground
                            imageStyle={{resizeMode: 'stretch'}}
                            source={images.wallet_qrcode_scan}
                            style={styles.imageScan}>
                            {new Page().QrCode({value: this.address, size: 160})}
                        </ImageBackground>
                    </View>
                    <View style={[css.colStartCenter, {paddingHorizontal: 30, paddingBottom: 25}]}>
                        <Page.Text text={'我的地址'} size={16} color={'#000'} lineHeight={30}/>
                        <Page.Text text={this.address} size={14} color={'#808080'} lineHeight={22} t={5}
                                   style={{textAlign: 'center'}}/>
                    </View>
                </View>
            </ImageBackground>
            <View style={{padding: 15}}>
                <Page.Text text={'复制地址'} style={css.btnStyle} onPress={() => {
                    new Page().Clipboard(this.address);
                }}/>
            </View>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    imageBg: {
        justifyContent: 'space-between',
        width: (css.width - 100),
        height: (css.width - 100) / 0.66,
        marginHorizontal: (css.width - (css.width - 100)) / 2
    },
    scanView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: (css.width - 90),
        height: (css.width - 90),
    },
    imageScan: {
        width: 190,
        height: 190,
        padding: 15,
    }
});
