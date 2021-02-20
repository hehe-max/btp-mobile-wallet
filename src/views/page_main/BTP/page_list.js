import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

import {Woma, Api, images, Wallets} from '../../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools, Loading,} = Woma;

export default class page_wallet_list extends Component {
    #name = 'page_wallet_list';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '(BTP)';

    constructor(props) {
        super(props);
        const {route} = props;
        this.id = route.params.id;
        this.token = new Wallets.Tools().getSelectWalletTokenById(this.id);
        const name = this.token.name.toLocaleUpperCase();
        this.title = `${name} ${this.#pageTitle}`;
        this.wallet = new Wallets.Tools().getSelectWallet();
        this.tabs = ['全部', '转入', '转出'];
        this.state = {
            tabIndex: 0,
            data: [],
            meta: {},
            amount: {},
            loading: true,
            refreshLoading: false,
            pagingLoading: true,
        };
    }

    componentDidMount() {
        this.#unmount.start();
        this.getData();
    }

    getData(tabIndex = 0, index = 1) {
        const size = 10;
        //根据地址获取交易记录
        new Wallets.BTP.Wallet().getTransaction(tabIndex, this.wallet.address, size, index).then(res => {
            if (!this.#unmount.confirm()) return;
            let list = res;
            if (index > 1) list = this.state.data.concat(list);
            this.setState({
                data: list,
                loading: false,
                refreshLoading: false,
                pagingLoading: res.length === size,
                pageIndex: index,
            })
        });
        //根据地址获取金额
        new Wallets.BTP.Wallet().getBalanceAll(this.wallet.address).then(res => {
            this.setState({amount: res});
        });
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    tabsView() {
        const css = this.#css;
        return this.tabs.map((item, key) => {
            let color = css.font.color;
            if (this.state.tabIndex === key) color = css.font.main;
            return <Page.Text text={item} color={color} size={16} lineHeight={60}
                              style={{width: 100, textAlign: 'center'}} key={key}
                              onPress={() => {
                                  if (this.state.tabIndex === key) return false;
                                  this.setState({
                                      tabIndex: key, loading: true,
                                      loadingPaging: false, list: [], pageIndex: 1
                                  }, () => this.getData(key, 1));
                              }}/>
        });
    }

    itemView() {
        const css = this.#css,
            styles = this.#styles;
        const {loading, data,} = this.state;
        console.log(data);
        if (loading) return new Loading().small();
        if (data.length === 0) return <Page.Text text={'暂无数据'} style={css.noData}/>;
        return data.map((item, key) => {
            let params = {value: '', color: css.font.color};
            if (item.stat === 0) {                  //成功
                params.value = '成功';
                params.color = css.font.main;
            } else if (item.stat === 1) {           //确认中
                params.value = '确认中';
                params.color = '#23c486';
            } else if (item.stat === 2) {           //未确认
                params.value = '未确认';
                params.color = '#007bff';
            } else if (item.stat === 3) {           //失败
                params.value = '失败';
                params.color = '#fb2740';
            }
            return <Page.Text key={key} style={[styles.borderBottom,]}
                              onPress={() => new Nav().go( 'WalletDetail_BTP', {data: item})}>
                <View style={css.rowBetweenCenter}>
                    <View>
                        <Page.Text text={params.value} color={params.color} lineHeight={26}/>
                        <Page.Text text={Tools.formatDate(item.time)} color={css.font.minor} size={12} lineHeight={24}/>
                    </View>
                    <Page.Text text={Tools.amount(item.amount)} lineHeight={22} size={16} style={{fontWeight: 'bold'}}/>
                </View>
                <View style={styles.itemAddr}>
                    <Page.Text text={Tools.cutString(item.addr, 15)} lineHeight={20} size={12}/>
                    <Page.Icon size={14} name={'cardb'} color={css.font.minor}/>
                </View>
            </Page.Text>
        })
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const {amount} = this.state;
        return <Page.Render this={this} isHeader={false}>
            <ImageBackground imageStyle={{resizeMode: 'stretch'}} source={images.wallet_list_bg}
                             style={{width: css.width, height: css.width * 0.535, paddingBottom: 20}}>
                <Page.Header title={this.title}/>
                <View style={[css.colAroundCenter, {paddingVertical: 20}]}>
                    <View style={css.rowStart}>
                        <Page.Text text={Tools.amount(amount.balance ?? 0)} r={10} size={25} color={css.font.main}/>
                        <Page.Text text={this.token.name.toLocaleUpperCase()} lineHeight={40}
                                   color={css.font.main}/>
                    </View>
                    <View style={[css.rowAroundCenter, {marginBottom: 10}]}>
                        <Page.Text text={`可用：${Tools.amount(amount.usable ?? 0)}`} color={css.font.minor} r={15}/>
                        <Page.Text text={`确认中：${Tools.amount(amount.locked ?? 0)}`} color={css.font.minor}/>
                    </View>
                    <Page.Text style={css.rowStartCenter}>
                        <Page.Text text={Tools.cutString(this.wallet.address)}/>
                        <Page.Icon name={'cardb'} size={20} l={15}/>
                    </Page.Text>
                </View>
            </ImageBackground>
            <View style={[css.innerRadius, {marginTop: -30}]}>
                <View style={[css.rowAroundCenter, styles.borderBottom]}>{this.tabsView()}</View>
                <Page.Slide style={{padding: 15}}>
                    {this.itemView()}
                </Page.Slide>
                <View style={[css.rowBetweenCenter, {padding: 15}]}>
                    <Page.Text text={'收 款'} style={[styles.btn, styles.btn2]}
                               onPress={() => new Nav().go( 'QrCode', {id: this.id})}/>
                    <Page.Text text={'转 账'} style={[styles.btn]}
                               onPress={() => new Nav().go( 'WalletTrading_BTP', {id: this.id})}/>
                </View>
            </View>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    btn: {
        ...css.btnStyle,
        width: (css.width - 45) / 2,
    },
    btn2: {
        backgroundColor: css.btn.bg2,
        borderColor: css.btn.bg2,
        color: css.font.white,
    },
    borderBottom: {
        borderBottomWidth: 0.5,
        borderBottomColor: css.list.line,
    },
    itemAddr: {
        ...css.rowBetweenCenter,
        marginVertical: 5,
        paddingBottom: 7,
    }
});
