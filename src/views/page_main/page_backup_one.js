import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, images} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools} = Woma;

export default class page_backup_one extends Component {
    #name = 'page_backup_one';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '抄写助记词';

    constructor(props) {
        super(props);
        const {route} = props;
        this.mnemonic = route.params.mnemonic;

        this.title = `${this.#pageTitle}`;
        this.state = {};
    }

    componentDidMount() {
        this.#unmount.start();
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    mnemonicView() {
        const css = this.#css,
            styles = this.#styles;
        const mnemonic = this.mnemonic.split(' ');
        return mnemonic.map((item, key) => {
            return <Page.Text key={key} style={{marginTop: 20}}>
                <View style={[css.btnStartStyle, {
                    // backgroundColor: 'rgba(0,0,0,0.2)',
                    width: (css.width - 30 - 100) / 3,
                }]}>
                    <Page.Text text={(key + 1).toString()} size={30} style={{fontWeight: 'bold', textAlign: 'center'}}
                               color={css.font.minor2} lineHeight={50}/>
                    <Page.Text text={item} size={16} lineHeight={50} color={css.font.white}
                               style={{
                                   position: 'absolute', textAlign: 'center', fontWeight: 'bold',
                                   width: (css.width - 30 - 100) / 3
                               }}/>
                </View>
            </Page.Text>
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Render this={this}>
            <Page.Slide style={[css.listStyle, {height: 'auto', marginTop: 20, marginHorizontal: 15}]}>
                <View style={[css.listLineStyle, css.colStartCenter, {height: 70}]}>
                    <Page.Text text={'请抄写以下助记词'} size={20} lineHeight={70}/>
                </View>
                <View style={[css.rowAround, {flexWrap: 'wrap', paddingBottom: 30, paddingTop: 10}]}>
                    {this.mnemonicView()}
                </View>
                <Page.Text text={'请仔细抄写上方助记词，我们将在下一步验证。'} color={css.font.minor}/>
                <Page.Text text={'请在四周无人，确保没有摄像头的安全环境进行备份。'} color={css.font.minor} t={20} b={30}/>
            </Page.Slide>

            <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                <Page.Text text={'下一步'} style={css.btnStyle} onPress={() =>
                    new Nav().go( 'BackupTwo', {mnemonic: this.mnemonic})}/>
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
