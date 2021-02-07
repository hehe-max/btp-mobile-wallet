import Woma from '../ConfFramework';

const {Fetch, Nav} = Woma;

export default class ConfFetch {
    constructor() {
    }

    //请求状态配置
    static status() {
        const fetchStatus = {};
        fetchStatus[Fetch.status.SERVE_TIMEOUT] = () => {
            //请求超时
        };
        fetchStatus[Fetch.status.SERVE_FAILED] = () => {
            //请求失败
        };
        fetchStatus[Fetch.status.SERVE_ERROR] = () => {
            //请求错误
        };
        fetchStatus[401] = () => {
            //没有权限
            new Fetch().setAuthValue(Fetch.auth.token, '');
            new Nav().empty('Login');
        };
        return fetchStatus;
    }

}
