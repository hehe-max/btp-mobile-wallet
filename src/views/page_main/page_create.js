import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

import {Woma, Api, images, Wallets} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Loading, Modal} = Woma;

export default class page_create extends Component {
    #name = 'page_create';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '创建钱包';

    constructor(props) {
        super(props);
        const {route} = props;
        this.title = `${this.#pageTitle}`;
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
        return <Page.Render this={this}>
            <Page.Slide style={{paddingHorizontal: 15}}>
                <View>
                    <Page.Text text={'钱包密码'} size={16} t={15}/>
                    <TextInput style={css.inputStyle} ref={'pwd'} maxLength={20}
                               password={true} secureTextEntry={true}
                               placeholder={'请输入6~20位密码'} placeholderTextColor={css.font.minor}
                               onChangeText={val => this.setState({pwd: val})}/>
                </View>
                <View>
                    <Page.Text text={'确认密码'} size={16} t={15}/>
                    <TextInput style={css.inputStyle} ref={'confirm'} maxLength={20}
                               password={true} secureTextEntry={true}
                               placeholder={'请输入6~20位确认密码'} placeholderTextColor={css.font.minor}
                               onChangeText={val => this.setState({confirm: val})}/>
                </View>
                <View>
                    <Page.Text text={'密码提示'} size={16} t={15}/>
                    <TextInput style={css.inputStyle} ref={'tips'} maxLength={20}
                               password={true} secureTextEntry={true}
                               placeholder={'选填'} placeholderTextColor={css.font.minor}
                               onChangeText={val => this.setState({tips: val})}/>
                </View>
            </Page.Slide>
            <View style={{padding: 15}}>
                <Page.Text text={'创建钱包'} style={css.btnStyle} onPress={() => {
                    new Page.Render().onBlur(this);
                    const state = this.state;
                    if (!state.pwd) return new Modal().alert('请输入密码');
                    if (state.pwd.length < 6) return new Modal().alert('密码不得小于6位');
                    if (state.confirm !== state.pwd) return new Modal().alert('两次密码不相等');
                    new Wallets.Tools().randomMnemonic().then(mnemonic => {
                        console.log(mnemonic);
                        new Wallets.Tools().createMainWallets(mnemonic, state.pwd, state.tips, false).then(wallets => {
                            new Loading().complete('钱包生成完成');
                            console.log(wallets);
                            new Wallets.Tools().setWalletTemporary(wallets);
                            new Wallets.Tools().setWalletMnemonicMain(mnemonic);
                            console.log(wallets);
                            setTimeout(() => {
                                new Loading().hide();
                                new Nav(this).go('Backup', {mnemonic});
                            }, 100);
                        })
                    });
                }}/>
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
