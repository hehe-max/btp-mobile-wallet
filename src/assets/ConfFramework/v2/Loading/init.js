import React, {Component} from "react";
import {View, ActivityIndicator, Animated, Text, StyleSheet} from 'react-native';
import Theme from "../Theme";
import Redux from "../Redux";

export default class LoadingInit extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    static data = 'framework_loading_data';
    static type = 'framework_loading_type';

    constructor(props) {
        super(props);
        this.state = {
            isDisplay: false,           //是否显示
        };
    }

    componentDidMount() {
        new Redux().listen(LoadingInit.data, res => {
            console.log(res);
            if (res.type === 0) {
                /**
                 * 隐藏loading
                 */
                this.setState({
                    type: res.type,
                    isDisplay: false,
                    content: undefined,
                    image: undefined,
                })
            } else if (res.type === 1) {
                /**
                 * 显示loading
                 */
                let state = {type: res.type, content: res.content, image: res.image};
                if (this.state.type !== 1) {
                    state['isDisplay'] = true;
                }
                this.setState(state);
            } else if (res.type === 2) {
                /**
                 * 只改变文字
                 */
                this.setState({
                    content: res.content
                });
            }
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const state = this.state;
        if (!state.isDisplay) return <View/>;
        //mask
        const styleMask = {};
        if (css.page.maskBg) styleMask.backgroundColor = css.page.maskBg;
        //loading View
        const styleLoading = {width: 170, height: 175};
        if (!css.loading) css.loading = {};
        if (css.loading.width) styleLoading.width = css.loading.width;
        if (css.loading.height) styleLoading.height = css.loading.height;

        //显示图片
        const imageView = typeof state.image === "undefined" ?
            <ActivityIndicator size={'large'} color={'#fff'}/> : state.image;

        return <View style={[styles.container, styleMask]}>
            <Animated.View style={[styles.loading, styleLoading]}>
                {imageView}
                <View style={[styles.content, {width: styleLoading.width}]}>
                    <Animated.View>
                        <Text style={styles.contentText}>{state.content ?? ''}</Text>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: css.width,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
    },
    loading: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    contentText: {
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 12,
    }
})
