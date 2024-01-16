import axios,{AxiosError,AxiosRequestConfig,Canceler} from "axios";

// 负责生成 Map中URL对应的key值
const generateURLKey = (config:AxiosRequestConfig) => ['cancel-url',config.method,config.url].join('&');

const axiosConfig:AxiosRequestConfig = {
  baseURL:'/api',  // api的base URL
  timeout: 10000,   // 请求超时时间 10秒
  responseType: 'json',  // 请求格式
  withCredentials: true,  // 是否允许携带token这些
  headers:{   // 设置请求头
    'Content-Type':'application/json;charset=utf-8',  // 传输数据类型
    'Access-Control-Allow-Origin':'*',    // 允许跨域
  }
};

// Axios实例
const Axios = axios.create(axiosConfig);
// 用于存放未完成请求的队列(待处理的请求)
const pending = new Map<string, Canceler>();

/* 每次请求，检查Map是否有之前未完成的请求，有就取消重新发送。路由切换的时候会取消当前页面所有请求 */


// 向Map中添加当前网络请求
const addPending = (aConfig:AxiosRequestConfig) => {
  const config = aConfig;
  const url = generateURLKey(config);
  config.cancelToken = config.cancelToken || 
  new axios.CancelToken((cancel: Canceler) => {
    if(!pending.has(url)){
      // 如果pending中不存在当前请求，则将其添加
      pending.set(url,cancel);
    }
  })
}

// 从Map中删除网络请求
const removePending = (config:AxiosRequestConfig) => {
  const url = generateURLKey(config);
  if(pending.has(url)){
    // 如果在pending中存在当前请求标识，需要取消当前请求，并且将其移除
    const cancel:Canceler = pending.get(url) as Canceler;
    cancel(url);
    pending.delete(url);
  }
}

// 清空Map中所有的请求标识，在Vue router中切换路由时调用
export const clearPending = () => {
  pending.forEach((item:Canceler) => {
    item('switch router');
  })
  pending.clear();
}

// 请求拦截器
Axios.interceptors.request.use(
  config => {
    removePending(config);  // 请求开始前，对之前的请求做检查取消操作
    addPending(config);  // 将当前请求添加到pending中
    const newConfig = config;

    // // 每次都去看看token是否存在。
    // if(localStorage.getItem('tokenName') != null){
    //   let tokenName = localStorage.getItem('tokenName')
    //   let tokenValue = localStorage.getItem('tokenValue')
    //   if(!newConfig.headers) newConfig.headers = <any>{};
    //   Object.assign(newConfig.headers,{'peekpa-token':tokenName+"="+tokenValue});
    // }else{
    //   console.log('token不存在！请先登录账号。')
    // }

    return newConfig;
  },
  (error:AxiosError):Promise<never> =>{
    // 对请求错误时调用
    return Promise.reject(error);
  }
);

// 响应拦截器
Axios.interceptors.response.use(
  response => {
    // console.log("响应拦截器",response);
    if(response.data.code == 500 || response.data.msg == "未提供token" || response.data.msg == "token无效"){
      console.log('请先登录账号,' + response.data.msg + '!')
    }
    return response;
  },
  (error:AxiosError):Promise<never> =>{
    // 对请求错误时调用
    return Promise.reject(error);
  }
);

// export default { Axios,axiosConfig };
export default Axios;