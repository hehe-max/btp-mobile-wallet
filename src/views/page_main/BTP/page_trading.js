import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, images, Wallets} from '../../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools} = Woma;

export default class page_wallet_trading extends Component {
    #name = 'page_wallet_trading';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '交易';

    constructor(props) {
        super(props);
        const {route} = props;
        this.id = route.params.id;
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
        return <Page.Render this={this}>

        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.bg,
        flex: 1,
    },
});
