import React, {Component} from 'react';
import {StyleSheet, View, AppRegistry, TextInput, Text} from 'react-native';
import {Woma, conf, confFetch, Api, confFonts, confTheme, confLanguage} from './assets';

const {Core, Theme, Page, Popup, Redux, Nav, Storage, Fetch, Language, Loading, Modal,} = Woma;

TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false});
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});
/**
 * -----------  框架初始化
 */
new Core().init();

new Redux({log: false}).init([
    {name: Nav.headerBar, value: Nav.barWhite},                         //导航Bar配色
    {name: Page.Icon.Name, value: Page.Icon.Init(confFonts)},           //字体
]);
//皮肤
new Theme().init(confTheme, 'default');
//语言
new Language().init(confLanguage, 'zh');
//导航
new Nav().init({headerLeftIconName: 'xiangzuo'});
//数据请求
new Fetch().init([
    {name: Fetch.params.log, value: false},                             //log
    {name: Fetch.params.timeout, value: 30000},                         //超时时间
    {name: Fetch.params.status, value: confFetch.status()},             //请求状态处理
    {name: Fetch.params.authValue, value: Fetch.auth.token},            //权限验证
    //数据请求  Api Host
    {name: Fetch.params.type, value: Api.host.formal},                  //正式
    // {name: Fetch.params.type,   value: Api.host.test},               //测试
]);
new Storage().init([
    {name: conf.AppAvatar, type: Storage.type.get, value: 'avatar_1'},      //头像
    {name: conf.AppNickName, type: Storage.type.get, value: 'nickname'},    //名称
    //钱包，助记词
    {name: conf.AppWallets, type: Storage.type.getJson, value: {}},         //  钱包
    {name: conf.AppWalletsMnemonic, type: Storage.type.getJson, value: {}}, //  助记词
]);
//Loading 配置
new Loading().init([
    {name: Loading.names.complete, type: Loading.type.icon, value: 'cardb'},
]);
//Modal 配置
new Modal().init();
//Popup 配置
new Popup().init();

/**
 * -----------  框架初始化
 */


import LoadingInit from "./assets/ConfFramework/v2/Loading/init";
import ModalInit from "./assets/ConfFramework/v2/Modal/init";
import PopupInit from "./assets/ConfFramework/v2/Popup/init";


const originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = (appKey, component) => {
    return originRegister(appKey, () => {
        //之前被注册过的根组件
        const OriginAppComponent = component();

        return class extends Component {
            render() {
                return <View style={styles.container}>
                    <OriginAppComponent/>
                    <LoadingInit/>
                    <ModalInit/>
                    <PopupInit/>
                </View>;
            }
        };
    });
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
