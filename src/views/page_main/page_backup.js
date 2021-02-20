import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, images} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools} = Woma;

export default class page_backup extends Component {
    #name = 'page_backup';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '请备份助记词';

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

    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Render this={this}>
            <Page.Text text={'立即备份'} style={css.btnStyle} onPress={() =>
                new Nav().go( 'BackupOne', {mnemonic: this.mnemonic})}/>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.bg,
        flex: 1,
    },
});
