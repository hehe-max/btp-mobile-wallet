import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

import {Woma, Api, images, Wallets} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Loading, Modal} = Woma;

export default class page_restore extends Component {
    #name = 'page_restore';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '恢复钱包';

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
                    <Page.Text text={'钱包密码'} size={16} t={15} b={15}/>
                    <TextInput style={styles.mnemonic} ref={'value'} value={this.state.value} maxLength={200}
                               placeholder={'请输入6~20位密码'} placeholderTextColor={css.font.minor}
                               multiline={true} onChangeText={val => this.setState({value: val})}/>
                </View>
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
                <Page.Text text={'恢复钱包'} style={css.btnStyle} onPress={() => {
                    new Page.Render().onBlur(this);
                    const state = this.state;
                    if (!state.value) return new Modal().alert('请输入助记词');
                    if (!new Wallets.Tools().verifyMnemonic(state.value)) return new Modal().alert('助记词有误，请检查');
                    if (!state.pwd) return new Modal().alert('请输入密码');
                    if (state.pwd.length < 6) return new Modal().alert('密码不得小于6位');
                    if (state.confirm !== state.pwd) return new Modal().alert('两次密码不相等');

                    new Wallets.Tools().createMainWallets(state.value, state.pwd, state.tips, true).then(wallets => {
                        new Loading().complete('钱包生成完成');
                        console.log(wallets);
                        new Wallets.Tools().setWalletTemporary(wallets);
                        new Wallets.Tools().setWalletMnemonicMain(state.value);
                        console.log(wallets);
                        setTimeout(() => {
                            new Loading().hide();
                            new Nav(this).empty('Main');
                        }, 100);
                    })
                }}/>
            </View>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    mnemonic: {
        borderWidth: 1,
        borderColor: css.page.line,
        borderRadius: 5,
        textAlignVertical: 'top',
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 80,
        lineHeight: 30,
        textAlign: 'left',
        fontSize: 14,
        color: css.font.color,
    }
});
