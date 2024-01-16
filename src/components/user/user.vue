<script setup lang="ts">
  import axios from '../../utils/axios' 
  import { reactive,ref } from 'vue'
  import { ElMessage,ElMessageBox,FormInstance, FormRules } from 'element-plus'
  import useStore from '../../store/modules/User'
  const store = useStore()

  let axiosDate:any;    // 原始数据
  const data = reactive<any>([]) // 渲染数据
  const dialogVisible = ref<any>(false)  // 添加用户弹出层
  // 搜索
  const userForm = reactive({
    userName: ''
  })
  // 获取数据
  getData();
  async function getData(){
    // 获取数据
    await axios.getJson("/user/selectUserList")
    .then((res:any) =>{ 
      // 保存一份原始数据
      axiosDate = res.data
      // 导入数据渲染
      setData(res.data)
    }).catch((err:Error)=>{
      console.log(err)
    })
  }

  // 导入数据
  function setData(dataArr:[]){
    data.length = 0
    dataArr.map((item:any) =>{
      item.creationTime = dateFormat(item.creationTime)
      data.push(item)
    })
  }

  // 搜索
  function onSubmit() {
    if(userForm.userName == ''){
      setData(axiosDate); return;
    } 

    data.length = 0
    axiosDate.map((item:any) => { 
      if(item.name.search(userForm.userName) != -1 ){
        data.push(item)
      }
    })
  }

  // 添加用户弹窗
  function addUsers() {
    dialogVisible.value = true
  }

  const handleClose = (done: () => void) => {
    ElMessageBox.confirm('您确定要关闭登录窗口吗?',{
      confirmButtonText: '确定',
      cancelButtonText: '取消'  
    }).then(() => {
      
      done()
    }).catch((err) => {
      console.log(err)
    })
  }

  /* 添加用户开始 */
  // 自定义表单验证
  interface addFormType{
    name:string,
    account: string,
    password: string,
  }
  const addForm = reactive<addFormType>({
    name:'',
    account: '',
    password: '',
  })
  const addFormRef = ref<FormInstance>()

  // 姓名校验
  const addName = (_rule: any, value: any, callback: any) => {
    !value ? callback(new Error('姓名不能为空！')):callback()
  }
  // 账号的校验   value:input内容  callback：提示内容
  const addAccount = (_rule: any, value: any, callback: any) => {
    // 手机号正则
    let accountRegExp = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/
    if (!value) {
      return callback(new Error('请输入账号，账号不能为空！'))
    }else if(!Number.isInteger(value)){
      callback(new Error('格式错误，请重新输入，账号由数字组成！'))
    }else if (value.toString().length != 11) {
      callback(new Error('账号位数不正确，账号由手机号组成！'))
    }else if(!accountRegExp.test(value)){
      callback(new Error('请您输入正确的手机号！'))
    }else{
      callback()
    }
  }
  // 密码的校验
  const addPassword = (_rule: any, value: any, callback: any) => {
    // 密码正则
    let passwordRegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/
    if (!value) {
      return callback(new Error('请输入密码，密码不能为空！'))
    }else if(!passwordRegExp.test(value)){
      callback(new Error('密码由数字、字母、下划线组成，同时包含数字和字母，长度为8-16位！'))
    }else{
      callback()
    }
  }
  // 关联表单校验规则函数
  const loginRules = reactive<FormRules<typeof addForm>>({
    name: [{ validator: addName, trigger: 'blur' }],
    account: [{ validator: addAccount, trigger: 'blur' }],
    password: [{ validator: addPassword, trigger: 'blur' }],
  })
  // 取消关闭窗口
  function cancel(){
    dialogVisible.value = false
  }
  // 取消（清空表单内容）
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  // 表单提交
  const submitAddForm = (formEl: FormInstance | undefined) => {
    // valid 校验是否通过
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        // 校验通过
        axios.getJson(`api/user/findUserName?account=${addForm.account}`).then((res:any) =>{ 
          if(res.code == 200){
            ElMessage.error({ message: "该账户已存在,请换一个手机号添加！", type: 'success' })
            return
          }else{
            // 账户不存在，可添加
            axios.postJson("api/user/addUserList",{
              name: addForm.name,
              account: addForm.account,
              password: addForm.password
            }).then((res:any) =>{ 
              if(res.code == 200){
                getData()
                ElMessage({ message: res.msg, type: 'success' })
                cancel()
                formEl.resetFields() // 清空
                return
              }
              ElMessage({ message: res.msg, type: 'success' })
              
            }).catch((err:Error)=>{
              console.log(err)
            })

          }
        }).catch((err:Error)=>{
          console.log(err)
        })
      }
    })
  }
  /* 添加用户结束 */
  async function deleteUser(id:number,index:number){
    ElMessageBox.confirm('您确定要删除该用户吗?',{
      confirmButtonText: '确定',
      cancelButtonText: '取消'  
    }).then(() => {
      axios.getJson(`api/user/deleteUserListById?id=${id}`)
      .then((res:any) =>{ 
        if(res.code == 200){
          // getData()
          data.splice(index,1);
          ElMessage({ message: res.msg, type: 'success' })
          return
        }
        // ElMessage({ message: res.msg, type: 'success' }) 
      }).catch((err:Error)=>{
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  // 返回固定的时间格式
  function dateFormat(creationTime:Date){
    let date = new Date(creationTime)
    return date.getFullYear()+"-"
        +(date.getMonth()+1).toString().padStart(2,"0")+"-"
        +date.getDate().toString().padStart(2,"0")
        +" "+date.getHours().toString().padStart(2,"0")
        +":"+date.getMinutes().toString().padStart(2,"0")
        +":"+date.getSeconds().toString().padStart(2,"0");
  }
</script>

<template>
  <div class="user">
    <div class="user_form">
      <el-form :inline="true" :model="userForm" class="demo-form-inline">
        <el-form-item label="真实姓名：">
          <el-input v-model="userForm.userName" placeholder="请输入真实姓名！" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="getData">刷新数据</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addUsers">添加人员账户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table" >
      <el-table 
        :data="data" 
        style="width: 100%;height:80vh;" 
        max-height="80vh"
        empty-text="暂无数据"
        border 
        scrollbar-always-on
        @selection-change="data" >
        <!-- <el-table-column type="selection" width="70" align="center" /> -->
        <el-table-column type="index" width="50" align="center" />
        <!-- <el-table-column label="编号" width="80" align="center">
          <template #default="scope">
            {{ scope.row.id }} 
          </template>
        </el-table-column> -->
        <el-table-column label="账号" width="150" align="center">
          <template #default="scope">
            {{ scope.row.account }} 
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" width="150" align="center">
          <template #default="scope">
            {{ scope.row.name }} 
          </template>
        </el-table-column>
        <el-table-column label="权限" width="150" align="center">
          <template #default="scope">
            <p v-if="scope.row.permission == 0"> 管理员账户 </p>
            <p v-else-if="scope.row.permission == 1"> 普通账户 </p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="250" align="center">
          <template #default="scope">
            {{ scope.row.creationTime }} 
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="deleteUser(scope.row.id,scope.$index)">
                删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加用户弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="添加账户"
    width="400px"
    :before-close="handleClose">
    <el-form
      ref="addFormRef"
      :model="addForm"
      status-icon
      :rules="loginRules"
      label-width="50px"
      class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.number="addForm.name" placeholder="请输入用户真实姓名" />
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model.number="addForm.account" placeholder="请输入用户的手机号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" type="password" autocomplete="off" placeholder="请输入账户密码" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel()">
          取消
        </el-button>
        <el-button @click="resetForm(addFormRef)">
          清空
        </el-button>
        <el-button type="primary" @click="submitAddForm(addFormRef)">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/deep/ .el-form-item__label{
   font-size: 16px;
   font-weight: 600;
}
</style>