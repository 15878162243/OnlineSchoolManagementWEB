<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive,ref,watch } from 'vue'

const route=useRoute()
// 当前导航绑定的路由
const routePath = ref(route.path)
// 监听路由
watch(
  () => route.path,
  () => {
    let path = '/' + route.path.split('/')[1]
    routePath.value = path
  }
)
const asideList:any[] = reactive([
    // {
    //   name:'首页',
    //   path:'/',
    //   icon:'HomeFilled'
    // },
    {
      name:'用户管理',
      path:'/',
      icon:'UserFilled'
    },{
      name:'课程管理',
      path:'/course',
      icon:'OfficeBuilding'
    },{
      name:'课程审批',
      path:'/courseApproval',
      icon:'School'
    },{
      name:'学员管理',
      path:'/student',
      icon:'Document'
    },{
      name:'教师课程管理',
      path:'/teacherCurriculum',
      icon:'Expand'
    }
  ])


// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
</script>

<template>
  <div id="aside">
    <el-menu
      active-text-color="#4A76AF"
      background-color="#2F4051"
      class="el-menu-vertical-demo"
      :default-active="routePath"
      text-color="#fff"
      @open=""
      @close=""
      router
    >
      <el-menu-item v-for="(item,index) in asideList" :key="index" :index="item.path" >
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <span icon="UserFilled">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>

.h1{
  background-color: #96bbec;
}
</style>