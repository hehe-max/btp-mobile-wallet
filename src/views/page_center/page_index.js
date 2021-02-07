import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {Woma, Api, images, Wallets} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools, Emitter} = Woma;

export default class page_center extends Component {
    #name = 'page_center';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);

    #popup_exit = 'popup_exit';

    constructor(props) {
        super(props);
        const {navigation, route} = props;
        this.items = [
            {icon: images.avatar_1, name: '多语言', onPress: () => new Nav(this).go('Language')},
            {icon: images.avatar_1, name: '地址本', onPress: () => new Nav(this).go('Language')},
            {icon: images.avatar_1, name: '关于我们', onPress: () => new Nav(this).go('About')},
        ];
        this.state = {};
    }

    componentDidMount() {
        this.#unmount.start();
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    itemView() {
        const css = this.#css,
            styles = this.#styles;
        return this.items.map((item, key) => {
            return <Page.Text key={key} style={styles.item} onPress={item.onPress}>
                <View style={css.rowBetweenCenter}>
                    <Image source={item.icon} style={styles.icon}/>
                    <Page.Text text={item.name} l={15}/>
                </View>
                <Page.Icon name={'cardb'} size={30}/>
            </Page.Text>
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Base>
            <Page.Render isHeader={false}>
                <Page.Text style={[css.rowBetweenCenter, {paddingHorizontal: 15, paddingVertical: 30}]}>
                    <View style={css.rowBetweenCenter}>
                        <Image source={images.avatar_1} style={{width: 50, height: 50}}/>
                        <Page.Text text={'11111'} l={15}/>
                    </View>
                    <Page.Icon name={'cardb'} size={30}/>
                </Page.Text>
                <View style={css.innerRadius}>
                    <Page.Slide style={{padding: 15}}>
                        {this.itemView()}
                        <Page.Text text={'退出'} style={css.btnStyle} onPress={() => {
                            Page.Popup.show(this, this.#popup_exit);
                            new Emitter().set('111', false);
                            // new Wallets.Tools().removeWalletAll();
                            // new Wallets.Tools().removeWalletMnemonicAll();
                            // setTimeout(() => {
                            //     new Nav(this).empty('PageIndex');
                            // }, 1000);
                        }}/>
                    </Page.Slide>
                </View>
            </Page.Render>
            <Page.Popup this={this} id={this.#popup_exit} height={Page.Popup.height["50"]}>

            </Page.Popup>
        </Page.Base>
    }
}

const styles = (css) => StyleSheet.create({
    item: {
        ...css.rowBetweenCenter,
        ...css.listRadiusStyle,
        marginBottom: 15,
    },
    icon: {
        width: 30,
        height: 30,
    },
});
