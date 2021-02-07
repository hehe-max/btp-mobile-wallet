import React from 'react';
import {Text} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import QRCode from "react-native-qrcode-svg";


import PageBase from "./PageBase";
import PageRender from "./PageRender";
import PageHeader from "./PageHeader";
import PageIcon from "./PageIcon";
import PageText from "./PageText";
import PageSlide from "./PageSlide";
import PagePopup from "./PagePopup";


export default class Page {
    constructor() {
    }

    static Base = PageBase;
    static Render = PageRender;
    static Header = PageHeader;
    static Icon = PageIcon;
    static Text = PageText;
    static Slide = PageSlide;
    static Popup = PagePopup;

    //剪切板
    Clipboard(value) {
        Clipboard.setString(value);
    }

    //二维码
    QrCode(params) {
        if (!params) params = {};
        return <QRCode value={params.value}
                       size={params.size ?? 100}
                       logo={params.logo}
                       color={params.color}
                       backgroundColor={params.bg}
                       logoSize={params.logoSize ?? 50}/>
    }
}
