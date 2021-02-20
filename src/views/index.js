import React, {Component} from 'react';
import {View, Platform, Image, StatusBar} from 'react-native';

import {Woma, conf, Wallets} from '../assets';

const {Nav, Page, Storage, Tools} = Woma;


export default class StartIndex extends Component {
    constructor(props) {
        super(props);
        new Nav().setThis(this);
    }

    componentDidMount() {
        const wallets = new Storage().getJson(conf.AppWallets);
        Promise.all([wallets]).then(res => {
            const wallet = res[0];
            console.log('启动', wallet);
            if (!wallet) return new Nav().empty('Start');
            if (!wallet.build) return new Nav().empty('Start');
            //判断版本缓存
            const build = Platform['OS'] === 'ios' ? conf.AppBuildIOS : conf.AppBuildAndroid;
            console.log(conf.AppVersion, build);
            console.log(wallet.version, wallet.build);
            if (Tools.versionContrast(conf.AppVersion, build, wallet.version, wallet.build))
                return new Nav().empty('VersionUpdate');
            return new Nav().empty('Main');
        });
    }

    render() {
        return <Page.Render this={this} isHeader={false}/>
    }
}
