import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {Woma, Api, images, Wallets} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Loading, Emitter} = Woma;

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
            {icon: images.avatar_1, name: '多语言', onPress: () => new Nav().go('Language')},
            {icon: images.avatar_1, name: '地址本', onPress: () => new Nav().go('Notepad')},
            {icon: images.avatar_1, name: '关于我们', onPress: () => new Nav().go('About')},
        ];
        this.state = {};
        navigation.addListener('tabPress', e => {
            console.log(111111111);
        });
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
                <Page.Icon name={'youjiantou'}/>
            </Page.Text>
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Base>
            <Page.Render this={this} isHeader={false}>
                <Page.Text style={[css.rowBetweenCenter, {paddingHorizontal: 15, paddingVertical: 30}]}>
                    <View style={css.rowBetweenCenter}>
                        <Image source={images.avatar_1} style={{width: 50, height: 50}}/>
                        <Page.Text text={'11111'} l={15}/>
                    </View>
                    {/*<Page.Icon name={'youjiantou'} size={30}/>*/}
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
                            //     new Nav().empty('PageIndex');
                            // }, 1000);
                        }}/>
                    </Page.Slide>
                </View>
            </Page.Render>
            <Page.Popup this={this} id={this.#popup_exit} height={Page.Popup.height["50"]}>
                <Page.Header title={'退出登录'}
                             left={<Page.Icon name={'cuowu'} l={15} onPress={() =>
                                 Page.Popup.hide(this, this.#popup_exit)}/>}/>
                <View style={[css.colBetween, {flex: 1, padding: 15}]}>
                    <View style={css.colAroundCenter}>
                        <Image source={images.center_exit} style={{width: 120, height: 120}}/>
                        <Page.Text text={'退出身份后将删除所有钱包数据，请务必确保所有钱包已备份。'}/>
                    </View>
                    <Page.Text text={'确定退出'} style={css.btnStyle} onPress={() => {
                        new Loading().start('正在退出中');
                        setTimeout(() => {
                            Page.Popup.hide(this, this.#popup_exit);
                            new Wallets.Tools().removeWalletAll();
                            new Wallets.Tools().removeWalletMnemonicAll();
                            new Loading().complete('退出成功', () => new Nav().empty('PageIndex'));
                        }, 1000);
                    }}/>
                </View>
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
