import './src/init';

import 'react-native-gesture-handler';
import React from 'react';
import {View, Image, Platform, BackHandler} from 'react-native';


import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Woma from './src/assets/ConfFramework';
import images from "./src/assets/Images";

const {Theme, Page, Language, Nav, Emitter} = Woma;
//导航
import page_main from "./src/views/page_main/page_index";
import page_center from "./src/views/page_center/page_index";

//页面
import page_index from "./src/views";
//  page_public
import page_about from "./src/views/page_public/page_about";
import page_coming_soon from "./src/views/page_public/page_coming_soon";
import page_browser from "./src/views/page_public/page_browser";
import page_languages from "./src/views/page_public/page_languages";
import page_scan from "./src/views/page_public/page_scan";
import page_theme from "./src/views/page_public/page_theme";
import page_version_list from "./src/views/page_public/page_version_list";
import page_version_detail from "./src/views/page_public/page_version_detail";
import page_version_update from "./src/views/page_public/page_version_update";
//main
import page_start from "./src/views/page_main/page_start";
import page_create from "./src/views/page_main/page_create";
import page_restore from "./src/views/page_main/page_restore";
import page_backup from "./src/views/page_main/page_backup";
import page_backup_one from "./src/views/page_main/page_backup_one";
import page_backup_two from "./src/views/page_main/page_backup_two";
import page_qrcode from "./src/views/page_main/page_qrcode";
//BTP
import page_btp_list from "./src/views/page_main/BTP/page_list";
import page_btp_detail from "./src/views/page_main/BTP/page_detail";
import page_btp_trading from './src/views/page_main/BTP/page_trading';

//center
import page_info from "./src/views/page_center/page_info";
import page_info_avatar from "./src/views/page_center/page_info_avatar";
import page_info_nickname from "./src/views/page_center/page_info_nickname";
import page_notepad from "./src/views/page_center/page_notepad";
import page_notepad_create from "./src/views/page_center/page_notepad_create";
import page_notepad_select from "./src/views/page_center/page_notepad_select";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const mavMain = class BottomNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplay: false,
        }
    }

    componentDidMount() {
        this.emitterNav = new Emitter().get(Nav.footerName, res => {
            console.log(res);
            this.setState({isDisplay: res});
        })
    }

    componentWillUnmount() {
        if (this.emitterNav) this.emitterNav.remove();
    }

    render() {
        const css = new Theme().get();
        const lang = new Language().all('nav');
        return <Tab.Navigator
            lazy={true}
            tabBar={props => {
                const nav = Page.Nav;
                const {state, navigation} = props;
                //导航每个item
                const itemView = () => {
                    const length = state.routes.length;
                    return state.routes.map((item, key) => {
                        let params = {text: '', icon: '', color: css.nav.color};
                        const isFocused = state.index === key;
                        if (item.name === 'PageMain') {
                            params.text = '首页';
                            params.icon = isFocused ? images.avatar_0 : images.avatar_1;
                        } else if (item.name === 'PageCenter') {
                            params.text = '我的';
                            params.icon = isFocused ? images.avatar_0 : images.avatar_1;
                        }
                        if (isFocused) params.color = css.nav.selectColor;
                        const itemStyle = {
                            width: parseInt(css.width / length),
                            height: css.nav.height,
                            ...css.rowAroundCenter,
                        };
                        return <Page.Text key={key} onPress={() => new Nav().go( item.name)}>
                            <View style={[itemStyle]}>
                                <View style={css.colAroundCenter}>
                                    <Image source={params.icon} style={{width: 20, height: 20}}/>
                                    <Page.Text text={params.text} t={8} color={params.color}/>
                                </View>
                            </View>
                        </Page.Text>
                    })
                }
                //nav总样式
                const style = {
                    width: css.width, height: css.nav.height,
                    backgroundColor: css.nav.bg,
                    borderTopWidth: 0.5, borderTopColor: css.nav.line
                };
                if (Platform.OS === 'ios' && parseFloat(Platform.Version) >= 10) {
                    style.height = style.height + 15;
                    style.paddingBottom = 15;
                }
                if (this.state.isDisplay) return <View/>;
                return <View style={[css.rowAroundCenter, style]}>{itemView()}</View>
            }}>
            <Tab.Screen name="PageMain" component={page_main} options={{title: lang['main']}}/>
            <Tab.Screen name="PageCenter" component={page_center} options={{title: lang['center']}}/>
        </Tab.Navigator>;
    }
}


export default class App extends React.Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.onBackPress());
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', () => this.onBackPress());
    }

    onBackPress() {
        // console.log(popup.view.isShow());
        // if (popup.view.isShow()) {
        //     popup.view.hide();
        //     return true;
        // }
        // return false;
    }

    render() {
        // const css = new Theme().get();
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={'PageIndex'}
                    lazy={true}
                    mode={'modal'}
                    headerMode={'screen'}
                    cardOverlayEnabled={true}
                    options={{
                        backgroundColor: 'rgba(0,0,0,0)'
                    }}
                    screenOptions={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,// 添加这一行会实现安卓下页面的左右切换，默认是从下到上
                        headerShown: false,//不显示导航
                    }}>
                    <Stack.Screen name="Main" component={mavMain} options={{
                        cardStyleInterpolator: Nav.fade
                    }}/>
                    <Stack.Screen name="PageIndex" component={page_index}/>
                    {/*  page_public  */}
                    <Stack.Screen name="About" component={page_about}/>
                    <Stack.Screen name="Language" component={page_languages}/>
                    <Stack.Screen name="Scan" component={page_scan}/>
                    <Stack.Screen name="Theme" component={page_theme}/>
                    <Stack.Screen name="VersionUpdate" component={page_version_update}/>
                    <Stack.Screen name="VersionList" component={page_version_list}/>
                    <Stack.Screen name="VersionDetail" component={page_version_detail}/>
                    <Stack.Screen name="ComingSoon" component={page_coming_soon}/>
                    <Stack.Screen name="Browser" component={page_browser}/>
                    {/*  page_main  */}
                    <Stack.Screen name="Start" component={page_start}/>
                    <Stack.Screen name="Create" component={page_create}/>
                    <Stack.Screen name="Restore" component={page_restore}/>
                    <Stack.Screen name="Backup" component={page_backup}/>
                    <Stack.Screen name="BackupOne" component={page_backup_one}/>
                    <Stack.Screen name="BackupTwo" component={page_backup_two}/>
                    <Stack.Screen name="QrCode" component={page_qrcode}/>
                    {/* BTP */}
                    <Stack.Screen name="WalletList_BTP" component={page_btp_list}/>
                    <Stack.Screen name="WalletDetail_BTP" component={page_btp_detail}/>
                    <Stack.Screen name="WalletTrading_BTP" component={page_btp_trading}/>
                    {/*  page_center  */}
                    <Stack.Screen name="Info" component={page_info}/>
                    <Stack.Screen name="InfoAvatar" component={page_info_avatar}/>
                    <Stack.Screen name="InfoNickname" component={page_info_nickname}/>
                    <Stack.Screen name="Notepad" component={page_notepad}/>
                    <Stack.Screen name="NotepadSelect" component={page_notepad_select}/>
                    <Stack.Screen name="NotepadCreate" component={page_notepad_create}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }


}


