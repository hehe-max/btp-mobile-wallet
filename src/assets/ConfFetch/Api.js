import Woma from '../ConfFramework';


const {fetch, Fetch} = Woma;

export default class Api {
    static host = {
        formal: '',//正式
        test: '',//测试
        local: '',//本地
    }

    #getHost = () => {
        return fetch.getType();
    }

    constructor() {
    }


}
