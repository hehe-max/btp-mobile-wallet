import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

import {Woma, Api, images, conf} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Redux, Popup, Modal, Emitter, Loading, Storage} = Woma;

export default class page_notepad_create extends Component {
    #name = 'page_notepad_create';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '添加地址本';

    constructor(props) {
        super(props);
        const {route} = props;
        this.title = `${this.#pageTitle}`;
        this.data = route.params.item ?? {};
        this.selects = [
            {text: 'BTP', type: 'btp'},
            {text: 'PMEER', type: 'pmeer'},
            // {text: 'ETH', type: 'eth'},
            // {text: 'BTC', type: 'btc'},
            // {text: 'TRX', type: 'trx'}
        ];
        let index = 0;
        if (this.data.type) this.selects.map((item, key) => {
            if (item.type === this.data.type) index = key;
        });
        this.state = {
            selectItem: this.selects[index],
            name: this.data.name ?? '',
            address: this.data.address ?? '',
        };

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
        const state = this.state;
        return <Page.Render this={this}>
            <Page.Slide style={{padding: 15}}>
                <Page.Text style={[css.listLineStyle, css.rowBetweenCenter, {paddingHorizontal: 0}]} onPress={() => {
                    new Popup().select(this.selects, index => {
                        console.log('select', index);
                        this.setState({selectItem: this.selects[index]});
                    }, {title: '请选择地址类型'});
                }}>
                    <Page.Text text={'类型'}/>
                    <Page.Text text={state.selectItem.text}/>
                </Page.Text>
                <Page.Text text={'名称'} t={15}/>
                <TextInput style={css.inputLineStyle} ref={'name'} maxLength={20} value={state.name}
                           placeholder={'请输入显示名称'} placeholderTextColor={css.font.minor}
                           onChangeText={val => this.setState({name: val})}/>
                <Page.Text text={'地址'} t={15}/>
                <TextInput style={css.inputLineStyle} ref={'address'} maxLength={100} value={state.address}
                           placeholder={'请输入地址'} placeholderTextColor={css.font.minor}
                           onChangeText={val => this.setState({address: val})}/>
            </Page.Slide>
            <Page.Text text={'确定'} style={[css.btnStyle, {margin: 15}]} onPress={() => {
                new Page.Render().onBlur(this);
                if (!state.name) return new Modal().alert('请输入名称');
                if (!state.address) return new Modal().alert('请输入地址');
                const notepad = new Redux().get(conf.AppNotepad) ?? [];
                const id = this.data.id;
                if (id) {       //修改
                    notepad.map((item, key) => {
                        if (item.id === id) {
                            item.name = state.name;
                            item.address = state.address;
                            item.type = state.selectItem.type;
                        }
                    })
                } else {        //添加
                    notepad.push({
                        id: `${state.selectItem.type}_${new Date().getTime()}`,
                        type: state.selectItem.type,
                        name: state.name,
                        address: state.address,
                    });
                }
                new Redux().update(conf.AppNotepad, notepad);
                new Storage().setJson(conf.AppNotepad, notepad);
                new Emitter().set('notepad', true);
                new Loading().complete(id ? '修改成功' : '添加成功', () => new Nav().back());
            }}/>
        </Page.Render>
    }
}

const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.bg,
        flex: 1,
    },
});
