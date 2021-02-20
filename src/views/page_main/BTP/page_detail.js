import React, {Component} from 'react';
import {View, StyleSheet, Image,} from 'react-native';

import {Woma, Api, images} from '../../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools} = Woma;

export default class page_wallet_detail extends Component {
    #name = 'page_wallet_detail';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '详细';

    constructor(props) {
        super(props);
        const {route} = props;
        this.data = route.params.data;
        this.title = `${this.#pageTitle}`;
        this.state = {};
    }

    componentDidMount() {
        this.#unmount.start();
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    itemView(item) {
        const css = this.#css,
            styles = this.#styles;
        if (item.length === 0) return <Page.Text text={'coinbase'} lineHeight={26}/>;
        return item.map((item, key) => {
            // if (item.isChange) return;
            return <Page.Text key={key} style={css.rowBetweenCenter} onPress={() => {
                Tools.copy(item.address);
            }}>
                <Page.Text text={item.address} lineHeight={26} size={12} color={css.font.minor}/>
                <Page.Text text={Tools.amount(item.amount)} size={12}/>
            </Page.Text>
        })
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const {header, vin, vout} = this.data.data;
        let itemType = {value: '', color: css.font.color};
        if (header.stat === 0) itemType = {
            id: '成功',
            text: '成功',
            color: css.font.main,
            icon: images.wallet_detail_ok
        };
        if (header.stat === 1) {
            let confirmations = this.data.progress.toString();
            if (confirmations === 0) confirmations = 5;
            if (confirmations === 100) confirmations = 95;
            itemType = {
                id: '确认中',
                text: `${'确认中'} ${confirmations}%`,
                color: '#23c486',
                icon: images.wallet_detail_ongoing
            };
        }
        if (header.stat === 2) itemType = {
            id: '未确认',
            text: '未确认',
            color: '#007bff',
            icon: images.wallet_detail_unconfirmed
        };
        if (header.stat === 3) itemType = {
            id: '失败',
            text: '失败',
            color: '#fb2740',
            icon: images.wallet_detail_fail
        };
        let noteView = <View/>;
        if (header.note) noteView = <View style={[css.listRadiusStyle, css.rowBetweenCenter, {marginTop: 15}]}>
            <Page.Text text={'备注'}/>
            <Page.Text text={header.note}/>
        </View>;
        return <Page.Render this={this}>
            <Page.Slide style={{paddingHorizontal: 15}}>
                <View style={[css.colStartCenter, {paddingTop: 30, paddingBottom: 15}]}>
                    <Image source={itemType.icon} style={{width: 60, height: 60}}/>
                    <Page.Text text={itemType.text} t={20} size={18} color={itemType.color}/>
                    <Page.Text text={Tools.formatDate(this.data.time)} lineHeight={40}/>
                </View>
                <Page.Text style={[css.listRadiusStyle, css.rowBetween, {height: 'auto', paddingVertical: 10}]}
                           onPress={() => {
                               Tools.copy(header.txid);

                           }}>
                    <Page.Text text={'交易号'} lineHeight={26} size={16}/>
                    <Page.Text text={header.txid} lineHeight={26} style={{width: css.width - 30 - 100}}
                               color={css.font.minor}/>
                </Page.Text>
                <View style={[css.listRadiusStyle, css.rowBetweenCenter, {marginTop: 15}]}>
                    <Page.Text text={'金额'}/>
                    <Page.Text text={`${Tools.amount(header.change)}`}/>
                </View>
                <View style={[css.listRadiusStyle, css.rowBetweenCenter, {marginTop: 15}]}>
                    <Page.Text text={'手续费'}/>
                    <Page.Text text={`${Tools.amount(header.fees)}`}/>
                </View>
                {noteView}
                <View style={[css.listRadiusStyle, {height: 'auto', paddingVertical: 10, marginTop: 15}]}>
                    <Page.Text text={'付款地址'} lineHeight={30}/>
                    {this.itemView(vin)}
                </View>
                <View style={[css.listRadiusStyle, {height: 'auto', paddingVertical: 10, marginTop: 15}]}>
                    <Page.Text text={'收款地址'} lineHeight={30}/>
                    {this.itemView(vout)}
                </View>
                <Page.Text style={[css.listRadiusStyle, css.rowBetweenCenter, {marginVertical: 15}]} onPress={() => {

                }}>
                    <Page.Text text={'查询详细信息'}/>
                    <Page.Icon name={'youjiantou'} size={16} color={css.font.white}/>
                </Page.Text>
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
