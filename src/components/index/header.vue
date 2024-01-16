<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessageBox,ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import axios from '../../utils/axios'

  const router = useRouter() 


  // 退出登录，并删除localStorage内存的状态
  function quit(){
    ElMessageBox.confirm(
      '确定退出当前账号?',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      axios.getJson("/login/logout")
      .then((res:any)=>{
        ElMessage({ message: res.msg, type: 'success' })
      }).catch((err:Error)=>{
        console.log(err)
      })
      localStorage.removeItem('tokenName')
      localStorage.removeItem('tokenValue')
      router.push('/login')
    })
  }

</script>

<template>
  <div class="header">
    <el-row :gutter="10" >
      <el-col :span="18"><div class="log">酒店管理系统</div></el-col>
      <el-col :span="4">
        <div class="header_user">       
          <span>欢迎：</span>
          <div class="header_user_dian"></div>
          <span>管理员</span>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="quit">
          <Unlock style="width: 1em; height: 1em; margin-right: 8px;" />
          <span @click="quit">安全退出</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
  .log{
    color: #fff;
    font-size: 20px;
    line-height: 60px;
    padding-left: 10px;
  }
  .header_user{
    min-width: 230px;
    display:flex; 
    justify-content:center; 
    align-items:center;
    line-height: 60px;
    font-size: 14px;
    color: #fff;
  }
  .header_user_dian{
    width: 10px;
    height: 10px;
    margin: 0 5px 0 15px;
    border-radius: 50%;
    font-size: 10px;
    background-color: rgb(21, 223, 71);
  }
  .quit{
    min-width: 120px;
    font-size: 14px;
    line-height: 60px;
    padding-left: 10px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  .quit:hover{
    color: #e0e0e0;
  }
  
</style>