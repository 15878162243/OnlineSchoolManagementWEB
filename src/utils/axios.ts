import request from './request.ts'
 
let axios = {
    // 这里定义 post json 请求
    postJson: (url:any, data:any) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'post',
                url: url,
                data: data,
            }).then((response:any) => {
                resolve(response.data);
            }).catch((error:any) => {
                reject(error);
            })
        });
    },
    getJson: (url:any) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'get',
                url: url,
            }).then((response:any) => {
                resolve(response.data);
            }).catch((error:any) => {
                reject(error);
            })
        });
    },
    // 下面可以定义 get、post、put、patch、delete、download等请求
}
 
export default axios;