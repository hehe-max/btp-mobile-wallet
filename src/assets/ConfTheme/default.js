let defStyle = {};

defStyle.default = {
    main: '#C9040D',
};
/**
 * 页面
 */
defStyle.page = {
    bg: '#f8f8f8',              //配置
    barBg: '#fefefe',           //配置
    maskBg: 'rgba(0,0,0,.1)',   //配置
    line: '#E1E1E1',            //配置
    innerBg: '#fdfcfc',
};
defStyle.popup = {
    maskBg: 'rgba(255,255,255,.1)',                 //配置
}
/**
 * header 配置
 */
defStyle.header = {
    leftColor: '#1F1F1F',  //配置
    color: '#1F1F1F',      //配置
    height: 50,         //配置
    bg: '#fefefe',      //配置
    line: '#E1E1E1'     //线条颜色
};
/**
 * font 字体
 */
defStyle.font = {
    size: 14,           //配置
    color: '#1F1F1F',      //配置
    minor: '#898888',
    minor2: '#3c3e48',
    main: '#C9040D',//主题色
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
    color: '#757779',
    selectColor: '#C9040D',
    bg: '#fff',
    selectBg: '#fff',
    line: '#d6d6d6',
};

/**
 * btn 样式
 */
defStyle.btn = {
    size: 16,
    height: 50,
    bg: '#C9040D',
    bg2: '#313541',
    color: defStyle.font.white,
    color2: defStyle.font.dark,
};
/**
 * list 样式
 */
defStyle.list = {
    height: 50,
    bg: '#F0F3F8',
    bg2: '#292d38',
    line: '#d7d7d7',
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
    borderColor: defStyle.list.line,
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
    borderBottomColor: defStyle.list.line,
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
    color: defStyle.font.color,
};

defStyle.inputLineStyle = {
    height: defStyle.list.height,
    borderBottomWidth: 0.5,
    borderBottomColor: defStyle.list.line,
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
