import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, images} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools} = Woma;

export default class page_version_update extends Component {
    #name = 'page_version_update';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '版本更新';

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

        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.bg,
        flex: 1,
    },
});
