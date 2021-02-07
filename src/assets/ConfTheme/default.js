let defStyle = {};

defStyle.default = {
    main: '#F1BA5A',
};
/**
 * 页面
 */
defStyle.page = {
    bg: '#151b2b',              //配置
    barBg: '#151b2b',           //配置
    maskBg: 'rgba(0,0,0,.3)',   //配置
    line: '#757888',            //配置
    innerBg: '#1f2131',
};
defStyle.popup = {
    maskBg: 'rgba(255,255,255,.1)',                 //配置
}
/**
 * header 配置
 */
defStyle.header = {
    leftColor: '#fff',  //配置
    color: '#fff',      //配置
    height: 50,         //配置
    bg: '#151b2b',      //配置
    line: '#1b2137'     //线条颜色
};
/**
 * font 字体
 */
defStyle.font = {
    size: 14,           //配置
    color: '#fff',      //配置
    minor: '#757888',
    minor2: '#3c3e48',
    main: '#F1BA5A',//主题色
    vice: '#25E79B',//副主题色
    dark: '#151B2B',//深色字体
    white: '#fff',
    black: '#000',
};
/**
 * header 配置
 */
defStyle.nav = {
    height: 65,
    color: '#c2c1c8',
    selectColor: '#F1BA5A',
    bg: '#282c38',
    selectBg: '#161a26',
    border: '#28293d',
};

/**
 * btn 样式
 */
defStyle.btn = {
    size: 16,
    height: 50,
    bg: '#F1BA5A',
    bg2: '#313541',
    color: defStyle.font.dark,
    color2: defStyle.font.white,
};
/**
 * list 样式
 */
defStyle.list = {
    height: 50,
    bg: '#292d3a',
    bg2: '#292d38',
    border: '#434350',
};

//按钮样式
defStyle.btnStyle = {
    backgroundColor: defStyle.btn.bg,
    color: defStyle.btn.color,
    height: defStyle.btn.height,
    lineHeight: defStyle.btn.height,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: defStyle.btn.bg,
    overflow: 'hidden',
    fontSize: defStyle.btn.size,
    textAlign: 'center',
    paddingHorizontal: 15,
};
defStyle.btnStartStyle = {
    ...defStyle.btnStyle,
    backgroundColor: defStyle.btn.bg2,
    borderColor: defStyle.btn.bg2,
    color: defStyle.btn.color2,
};

//列表样式
defStyle.listStyle = {
    backgroundColor: defStyle.list.bg,
    height: defStyle.list.height,
    borderWidth: 0.5,
    borderColor: defStyle.list.border,
    overflow: 'hidden',
    paddingHorizontal: 15,
};
defStyle.listRadiusStyle = {
    ...defStyle.listStyle,
    borderRadius: 5,
};
defStyle.listLineStyle = {
    height: defStyle.list.height,
    borderBottomWidth: 0.5,
    borderBottomColor: defStyle.list.border,
    paddingHorizontal: 15,
};

//没有值 样式
defStyle.noData = {
    color: defStyle.font.minor,
    textAlign: 'center',
    lineHeight: 50,
    height: 50
};

//input
defStyle.inputStyle = {
    height: defStyle.list.height,
    borderBottomWidth: 0.5,
    borderBottomColor: defStyle.page.line,
    paddingHorizontal: 5,
    color: defStyle.font.color,
};

defStyle.inputDefaultStyle = {
    height: defStyle.list.height,
    paddingHorizontal: 5,
    color: defStyle.font.color,
};

//inner
defStyle.inner = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: defStyle.page.bg,
};

//innerRadius
defStyle.innerRadius = {
    ...defStyle.inner,
    backgroundColor: defStyle.page.innerBg,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
};


export default defStyle
