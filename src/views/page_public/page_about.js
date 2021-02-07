import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, images} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools, System} = Woma;

export default class page_about extends Component {
    #name = 'page_about';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '关于我们';

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
            <View>
                <Page.Text text={'版本信息'}/>
                <Page.Text text={`${System.version}(${System.build})`}/>
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
