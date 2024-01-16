<script setup lang="ts">
import { watch,onBeforeMount  } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'
  import axios from './utils/axios'
  import { useRouter,useRoute } from 'vue-router'
  const router = useRouter() 
  const route = useRoute()
  // 每次路由跳转都判断一下登录状态(是否为true)
  watch(
    () => route.path,
    () => {
      LoginState()
    }
  )

  // 每次刷新和进入网站都判断一下登录状态(是否为true)
  onBeforeMount(()=>{
    LoginState()
  })

  async function LoginState(){
    await axios.getJson("/login/isLogin")
    .then((res:any) =>{ 
      if(!res.data){
        router.push("/login")
      }
    }).catch((err:Error)=>{
      console.log(err)
    })
  }

</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>
*{margin: 0;padding: 0;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 0!important;
  padding: 0!important;
}

.el-header,
.el-main{
  padding: 0 !important;
}

ul{
  padding: 0px !important;
  padding-inline-start: 0px !important;
}
</style>
