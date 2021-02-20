import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {Woma, Api, conf} from '../../assets';

const {Unmount, Language, Nav, Theme, Page, Tools, Redux, Emitter} = Woma;

export default class page_notepad_select extends Component {
    #name = 'page_notepad_select';
    #unmount = new Unmount(this.#name);
    #lang = new Language().get(this.#name);
    #css = new Theme().get();
    #styles = styles(this.#css);
    #pageTitle = '选择地址';

    constructor(props) {
        super(props);
        const {route} = props;
        this.type = route.params.type;
        this.emitter = route.params.emitter;
        this.title = `${this.#pageTitle}`;
        this.state = {};
    }

    componentDidMount() {
        this.#unmount.start();
    }

    componentWillUnmount() {
        this.#unmount.end();
    }

    itemView() {
        const css = this.#css,
            styles = this.#styles;
        let notepad = new Redux().get(conf.AppNotepad) ?? [];
        if (this.type) notepad = Tools.selectArrayByArray(notepad, 'type', this.type);
        if (notepad.length === 0) return <Page.Text text={'暂无数据'} style={css.noData}/>;
        return notepad.map((item, key) => {
            return <Page.Text key={key} onPress={() => {
                new Emitter().set(this.emitter, item);
                new Nav().back();
            }}>
                <View style={[css.listLineStyle, css.rowBetweenCenter, {height: 60}]}>
                    <View style={{flexGrow: 1}}>
                        <View style={css.rowStartCenter}>
                            <Page.Text text={item.name} r={10}/>
                            <Page.Text text={item.type.toLocaleUpperCase()}/>
                        </View>
                        <Page.Text text={item.address} size={12}/>
                    </View>
                </View>
            </Page.Text>
        })
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        return <Page.Render this={this}>
            <Page.Slide style={{paddingHorizontal: 15}}>
                {this.itemView()}
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
