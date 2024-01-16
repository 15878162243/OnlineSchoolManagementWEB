<script setup lang="ts">
  import Aside from './aside.vue'
  import Header from './header.vue'
  import axios from '../../utils/axios'
  
  add()
  async function add(){
    await axios.getJson("/user/selectUserList")
    .then((res:any) =>{ 
      console.log(res)
    }).catch((err:Error)=>{
      console.log(err)
    })

    await axios.getJson("/login/isLogin")
    .then((res:any) =>{ 
      console.log(res)
    }).catch((err:Error)=>{
      console.log(err)
    })
  }
  
</script>

<template>
  <div class="index" >
    <div>
      <el-container>
        <el-header style="background-color: #4a76af;">
          <div class="header">
            <Header />
          </div>
        </el-header>

        <el-container> 
          <el-aside width="200px" class="aside">
            <Aside />
            <div class="child"></div>
          </el-aside>
          
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
    
  </div>

</template>

<style scoped>
  .aside{
    background-color: #2F4051;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
  }
  .child {
    flex: 1;
    background-color: #2F4051;
  }
  .header{
    min-width: 800px;
  }

</style>../../utils/request