import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, Wallets} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools, Modal, Loading} = Woma;

export default class page_backup_two extends Component {
    #name = 'page_backup_two';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '确认助记词';

    constructor(props) {
        super(props);
        const {route} = props;
        this.title = `${this.#pageTitle}`;
        this.mnemonic = route.params.mnemonic;
        this.mnemonicArr = this.mnemonic.split(' ');
        this.state = {
            index: 0,
            mnemonicShuffle: [],
            mnemonicInput: [],
            isPress: false,
            errIndex: 0,
            errMaxIndex: 3,
        };
    }

    componentDidMount() {
        this.#unmount.start();
        this.selectData();
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    //选择计算
    selectData() {
        let arr = Tools.copy(this.mnemonicArr);
        if (this.state.isPress) return new Loading().hide();
        arr.splice(this.state.index, 1);
        arr = Tools.shuffle(arr);
        arr = arr.splice(4, 5);
        const correct = this.mnemonicArr[this.state.index];
        arr.push(correct);
        arr = Tools.shuffle(arr);
        this.setState({
            mnemonicShuffle: arr
        }, () => {
            new Loading().hide();
        })
    }

    mnemonicView() {
        const css = this.#css,
            styles = this.#styles;
        const mnemonic = this.mnemonic.split(' ');
        return mnemonic.map((item, key) => {
            let params = {
                color: css.font.minor2,
                text: undefined,
            };
            const text = <Page.Text text={item} lineHeight={50} color={css.font.white} style={{
                position: 'absolute', textAlign: 'center', width: (css.width - 30 - 100) / 3
            }}/>;
            if (this.state.index === key && !this.state.isPress) params.color = css.font.main;
            if (this.state.index > key || this.state.isPress) params.text = text;
            return <Page.Text key={key} style={{marginTop: 10}}>
                <View style={[css.btnStartStyle, {
                    width: (css.width - 30 - 100) / 3,
                }]}>
                    <Page.Text text={(key + 1).toString()} size={30} style={{fontWeight: 'bold', textAlign: 'center'}}
                               color={params.color} lineHeight={50}/>
                    {params.text}
                </View>
            </Page.Text>
        });
    }

    selectView() {
        const css = this.#css,
            styles = this.#styles;
        const {mnemonicShuffle} = this.state;
        if (mnemonicShuffle.length === 0) return;
        return mnemonicShuffle.map((item, key) => {
            return <Page.Text key={key} style={{marginTop: 10}} onPress={() => {
                if (this.state.isPress) return;
                this.selectVerify(item);
            }}>
                <View style={[css.btnStartStyle, {
                    width: (css.width - 30 - 100) / 3,
                    paddingHorizontal: 0,
                }]}>
                    <Page.Text text={item} lineHeight={50} style={{textAlign: 'center'}} color={css.font.white}/>
                </View>
            </Page.Text>
        });
    }

    //选择验证
    selectVerify(val) {
        const lang = this.#lang;
        const state = this.state;
        let isPress = false;
        const verifyText = this.mnemonicArr[this.state.index];

        if (verifyText !== val) {
            if (state.errIndex + 1 >= state.errMaxIndex)
                return new Modal().alert('助记词输入错误3次，请验证是否抄写正确', () => new Nav(this).back());
            this.setState({errIndex: this.state.errIndex + 1})
            return new Modal().alert(`${'助记词选择不正确'}，(${state.errIndex + 1} / ${state.errMaxIndex})`);
        }
        // if (verifyText !== val) return false;
        if (this.state.index >= this.mnemonicArr.length - 1) isPress = true;
        new Loading().show();
        if (isPress) return this.setState({isPress: isPress}, () => new Loading().hide());
        this.setState({
            index: this.state.index + 1,
        }, () => this.selectData());
    }

    //跳转页面
    finish(isVerify) {
        let wallets = new Wallets.Tools().getWallet();
        if (isVerify) {
            wallets.main.map((item, key) => {
                item.verify = true;
                item.time.push(new Date().getTime());
            });
        }
        new Wallets.Tools().setWallet(wallets);
        new Nav(this).empty('Main');
    }


    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Render this={this}>
            <Page.Slide style={css.inner}>
                <View style={[css.listStyle, {height: 'auto', marginTop: 10, marginHorizontal: 15}]}>
                    <View style={[css.listLineStyle, css.colAroundCenter, {height: 80}]}>
                        <Page.Text text={'为了确保您已将助记词正确保存，请选择对应序号的单词。'} size={16} lineHeight={20}/>
                    </View>
                    <View style={[css.rowAround, {flexWrap: 'wrap', paddingBottom: 30, paddingTop: 10}]}>
                        {this.mnemonicView()}
                    </View>
                    <View style={[{
                        paddingVertical: 15,
                        marginBottom: 20,
                        backgroundColor: css.list.bg2,
                        borderRadius: 5,
                    }]}>
                        <View style={[css.listLineStyle, {marginHorizontal: 15, height: 40}]}>
                            <Page.Text text={`#${this.state.index + 1}`} color={css.font.main} size={20}
                                       style={{fontWeight: 'bold'}}/>
                        </View>
                        <View style={[css.rowAround, {flexWrap: 'wrap'}]}>
                            {this.selectView()}
                        </View>
                    </View>

                </View>
                <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                    <View style={css.rowEndCenter}>
                        <Page.Text text={'跳过'} lineHeight={50} onPress={() => this.finish(false)}/>
                    </View>
                    <Page.Text text={'确定'} style={css.btnStyle}
                               isPress={this.state.isPress} noPressColor={css.font.minor}
                               onPress={() => {
                                   this.finish(true);
                               }}/>
                </View>
            </Page.Slide>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.bg,
        flex: 1,
    },
});
