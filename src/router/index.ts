import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/login', name:"Login", component: ()=>import('../components/login/login.vue') },
  {
    path: '/index', 
    name: "Index", 
    component: ()=>import('../components/index/index.vue'),
    children:[
      { path: '/', name:"User", component: ()=>import('../components/user/user.vue') },
      { path: '/course', name:"Course", component: ()=>import('../components/course/course.vue') },
      { path: '/courseApproval', name:"CourseApproval", component: ()=>import('../components/courseApproval/courseApproval.vue') },
      { path: '/student', name:"Student", component: ()=>import('../components/student/student.vue') },
      { path: '/teacherCurriculum', name:"TeacherCurriculum", component: ()=>import('../components/teacherCurriculum/teacherCurriculum.vue') },
    ]
  }
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 内部提供了 history 模式的实现（createWebHistory）。这里使用的是 hash 模式。
  history: createWebHashHistory(),
  routes, 
})

export default router
