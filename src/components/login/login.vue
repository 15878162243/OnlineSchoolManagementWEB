<script setup lang="ts">
  import { ElMessage,FormInstance, FormRules } from 'element-plus'
  import { reactive,ref } from 'vue'
  import axios from '../../utils/axios'
  import { useRouter } from 'vue-router'
  const router = useRouter() 

  const checkbox = ref()


  /* 登录开始 */
  // 自定义表单验证
  interface LoginFormType{
    logAccount: string,
    logPassword: string,
  }
  const loginForm = reactive<LoginFormType>({
    logAccount: '',
    logPassword: '',
  })
  const loginFormRef = ref<FormInstance>()
  // 账号的校验   value:input内容  callback：提示内容
  const loginAccount = (_rule: any, value: any, callback: any) => {
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
  const loginPassword = (_rule: any, value: any, callback: any) => {
    // 密码正则
    let passwordRegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_.]{8,16}$/
    if (!value) {
      return callback(new Error('请输入密码，密码不能为空！'))
    }else if(!passwordRegExp.test(value)){
      callback(new Error('由长度为8-16位同时包含数字和字母组成，可用下划线、小数点。'))
    }else{
      callback()
    }
  }
  // 关联表单校验规则函数
  const loginRules = reactive<FormRules<typeof loginForm>>({
    logAccount: [{ validator: loginAccount, trigger: 'blur' }],
    logPassword: [{ validator: loginPassword, trigger: 'blur' }],
  })
  /* 登录结束 */


  // 表单提交
  const submitForm = (formEl: FormInstance | undefined) => {
    // valid 校验是否通过 
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log(checkbox)
        if(!checkbox.value) return ElMessage.error('您需要阅读并同意《星海智慧课堂管理系统隐私政策》 《星海智慧课堂管理系统使用协议》');
        // 验证账号密码是否正确
        axios.postJson("/login/doLogin",{
          account: loginForm.logAccount,
          password: loginForm.logPassword
        }).then((res:any) =>{
          if(res.code == 200){
            localStorage.setItem('tokenName',res.data.token.tokenName)
            localStorage.setItem('tokenValue',res.data.token.tokenValue)
            
            ElMessage({ message: '登录成功', type: 'success' })
            formEl.resetFields()
            router.push('/') 
          }else{
            return ElMessage.error('账号或密码不正确！')
          }
        })
      } else {
        return false
      }
    })
  }

</script>

<template>
  <div id="login">
    <div class="login_header">
      <el-row>
        <el-col :span="12" class="login_header_headline"><div>星海智慧课堂管理系统</div></el-col>
        <el-col :span="12" class="login_header_service"><div>401-666-8888</div></el-col>
      </el-row>
    </div>
    
    <div id="login_main">
      <el-row>
        <el-col class="login_main_height" :sm="0" :md="4" :lg="6" :xl="8"><div>星海智慧课堂管理系统</div></el-col>
        <el-col class="login_main_height" :sm="24" :md="20" :lg="18" :xl="16">
          <div class="login_form">
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              status-icon
              :rules="loginRules"
              class="demo-ruleForm">
              <h2 class="login_dl">登录</h2>
              <el-form-item prop="logAccount">
                <el-input  v-model.number="loginForm.logAccount" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item prop="logPassword">
                <el-input v-model="loginForm.logPassword" type="password" autocomplete="off" placeholder="请输入密码" />
              </el-form-item>
                <div class="login_wjmm"><a href="javascript:void(0)">忘记密码?</a></div>
              <el-form-item>
                <el-button class="login_button" type="primary" @click="submitForm(loginFormRef)">
                  登录
                </el-button>
              </el-form-item>
              <div>
                <input type="checkbox" v-model="checkbox" style="float: left;">
                <div> 
                  我已阅读并同意
                  <a href="javascript:void(0)">《星海智慧课堂管理系统隐私政策》</a>
                  <a href="javascript:void(0)">《星海智慧课堂管理系统使用协议》</a>
                </div>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
      
    </div>
  </div>
  
</template>

<style scoped>
  #login {
    width: 100%;
    height: 100vh;
    background-color: #43a3fd;
  }
  .login_header{
    width: 100%;
    height: 80px;
    background-color: rgb(255, 255, 255);
  }
  .login_header_headline,.login_header_service{
    text-align: center;
    line-height: 80px;
  }
  .login_header_headline div{
    font-size: 30px;
    font-weight: 700;
  }
  .login_header_service div{
    font-size: 20px;
    font-weight: 500;
  }
  .login_main_height{
    height: 80vh;
  }
  .login_form{
    margin: 15% auto;
    width: 450px;
    padding: 50px;
    border-radius: 10px;
    background-color: #fff;
  }
  .login_dl{
    padding-bottom: 10px;
    text-align: center;
  }
  .login_wjmm{
    width: 350px;
    text-align: right;
  }
  .login_wjmm a{
    color: #000;
  }
  .login_button{
    width: 100%;
    height: 50px;
    margin-top: 10px;
  }

  /* 输入框高度 */
  /deep/ .el-input__inner {
    height: 50px !important;
  }
  /* 输入框背景色 */
  /deep/ .el-input__wrapper {
    background: #F2F3F5;
  }
</style>