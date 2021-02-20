import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

import {Woma, Api, images} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Popup, Modal, popup} = Woma;

export default class page_start extends Component {
    #name = 'page_start';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '开始页面';

    constructor(props) {
        super(props);
        const {route} = props;
        this.title = `${this.#pageTitle}`;
        this.headerLeft = <View/>;
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
        return <Page.Render this={this} isHeader={false} innerStyle={css.colAround}>
            <ImageBackground source={images.start_bg_1} imageStyle={{resizeMode: 'stretch'}} style={[{
                width: css.width,
                height: css.width * 0.736,
                paddingHorizontal: 50,
                paddingTop: css.width * 0.736 * 0.11,
                paddingBottom: css.width * 0.736 * 0.22,
            }, css.colBetweenCenter]}>
            </ImageBackground>

            <View style={{padding: 15}}>
                <Page.Text text={'创建钱包'} style={[css.btnStyle, {marginBottom: 15}]}
                           onPress={() => new Nav().go( 'Create')}/>
                <Page.Text text={'恢复钱包'} style={css.btnStyle}
                           onPress={() => new Nav().go( 'Restore')}/>
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
