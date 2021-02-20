import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, images, conf} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools, Storage, Emitter, Redux} = Woma;

export default class page_notepad extends Component {
    #name = 'page_notepad';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '模板';

    constructor(props) {
        super(props);
        const {route} = props;
        this.title = `${this.#pageTitle}`;
        this.state = {
            isEdit: false,
            data: new Redux().get(conf.AppNotepad) ?? [],
        };
    }

    componentDidMount() {
        this.#unmount.start();
        this.emitterNotepad = new Emitter().get('notepad', () => {
            if (!this.#unmount.confirm(this.#name)) return;
            this.setState({data: new Redux().get(conf.AppNotepad) ?? []})
        })
    }

    componentWillUnmount() {
        this.#unmount.end();
        if (this.emitterNotepad) this.emitterNotepad.remove();
    }

    itemView() {
        const css = this.#css,
            styles = this.#styles;
        const {data, isEdit} = this.state;
        if (data.length === 0) return <Page.Text text={'暂无数据'} style={css.noData}/>;
        return data.map((item, key) => {
            let removeView = <View/>
            if (isEdit) removeView = <Page.Text text={'删除'} onPress={() => {
                data.splice(key, 1);
                new Redux().update(conf.AppNotepad, data);
                new Storage().setJson(conf.AppNotepad, data);
                this.setState({data});
            }}/>;
            return <Page.Text key={key} onPress={() => new Nav().go('NotepadCreate', {item})}>
                <View style={[css.listLineStyle, css.rowBetweenCenter, {height: 60}]}>
                    <View style={{flexGrow: 1}}>
                        <View style={css.rowStartCenter}>
                            <Page.Text text={item.name} r={10}/>
                            <Page.Text text={item.type.toLocaleUpperCase()}/>
                        </View>
                        <Page.Text text={Tools.cutString(item.address)}/>
                    </View>
                    {removeView}
                </View>
            </Page.Text>
        })
    }


    render() {
        const css = this.#css,
            styles = this.#styles;
        const {isEdit} = this.state;
        return <Page.Render this={this} headerRight={<View>
            <Page.Text text={isEdit ? '确定' : '编辑'} r={15} onPress={() => {
                this.setState({isEdit: !isEdit})
            }}/>
        </View>}>
            <Page.Slide style={{paddingHorizontal: 15}}>
                {this.itemView()}
            </Page.Slide>
            <Page.Text text={'添加'} style={[css.btnStyle, {margin: 15}]}
                       onPress={() => new Nav().go('NotepadCreate')}/>
        </Page.Render>
    }
}

const
    styles = (css) => StyleSheet.create({
        container: {
            backgroundColor: css.bg,
            flex: 1,
        },
    });
