import { defineStore } from 'pinia'
import { UserAuthorizeInfo } from "../../types/User";

const PEEKPAJOB_USER = 'PeekpaJobUser'

const userStore = defineStore('User',{
  state:():UserAuthorizeInfo => {
      const localData = localStorage.getItem(PEEKPAJOB_USER);
      const defaultValue:UserAuthorizeInfo = {
        id:'',
        name:'',
        token:''
      }
      return localData ? JSON.parse(localData) : defaultValue;
  },
  getters:{
    // 获取用户Id
    getId(state:UserAuthorizeInfo):string{
      return state.id;
    },
    // 获取用户姓名
    getName(state:UserAuthorizeInfo):string{
      return state.name;
    },
    // 获取用户token
    getToken(state:UserAuthorizeInfo):string{
      return state.token;
    }
  },
  actions:{
    //判断是否有用户登录信息
    isLogin():boolean{
      return this.token !== ''
    },
    // 存储/更新用户信息
    setUser(userData:UserAuthorizeInfo):void{
      this.id = userData.id;
      this.name = userData.name;
      this.token = userData.token;
      localStorage.setItem(PEEKPAJOB_USER,JSON.stringify(userData));
    },
    // 退出登录
    logout() {
      localStorage.removeItem(PEEKPAJOB_USER);
      this.id = '';
      this.name = '';
      this.token = '';
    }
  }
})

export default userStore;