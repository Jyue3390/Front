<template>
  <div class="login-container">
    <el-form v-if="!isRegistering" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <!-- 登录标题 -->
      <div class="title-container">
        <h3 class="title">欢迎登录电子相册</h3>
      </div>

      <!-- 用户名输入 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <!-- 密码输入 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="loginForm.password" :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- 注册切换按钮 -->
      <div class="tips">
        <span>还没有账号？</span>
        <el-button type="text" @click="toggleRegister">注册</el-button>
      </div>
    </el-form>

    <!-- 注册表单 -->
    <el-form v-else ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on" label-position="left">
      <!-- 注册标题 -->
      <div class="title-container">
        <h3 class="title">注册新用户</h3>
      </div>

      <!-- 注册用户名 -->
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="Username" name="username" type="text" />
      </el-form-item>

      <!-- 注册密码 -->
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="Password" name="password" />
      </el-form-item>

      <!-- 注册邮箱 -->
      <el-form-item prop="email">
        <el-input v-model="registerForm.email" placeholder="Email" name="email" type="email" />
      </el-form-item>

      <!-- 注册提交按钮 -->
      <el-button type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleRegister">注册</el-button>

      <!-- 返回登录按钮 -->
      <el-button type="text" @click="toggleRegister">返回登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { register } from '@/api/user' // 导入新增的注册 API
// import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不得少于6位'))
      } else {
        callback()
      }
    }
    return {
      isRegistering: false, // 切换登录/注册状态
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        email: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', type: 'email', message: '请输入正确的邮箱地址' }]
      },
      loading: false,
      passwordType: 'password'
    }
  },
  methods: {
    toggleRegister() {
      this.isRegistering = !this.isRegistering
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // 根据角色重定向
            const role = this.$store.state.user.role
            if (role === 'admin') {
              this.$router.push('/admin/dashboard')
            } else if (role === 'editor') {
              this.$router.push('/editor/dashboard')
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register({ ...this.registerForm, role: 'editor' }).then(() => {
            this.$message.success('注册成功，请登录')
            this.toggleRegister()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.8);
    background: rgba(131, 145, 145, 0.43);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #005bdc;
$dark_gray: #000405;
$light_gray: #000000;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-image:  linear-gradient(45deg, #b2eef6, #6278f6);// url(../../assets/bg.jpg); //背景图
  background-size: 100%;
  display: flex;
  align-items: center;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    background-color: rgba(243, 243, 243, 0.76);  // 背景颜色
    border-radius: 5px;             // 表单圆角
    opacity: 0.35;                  // 透明度，值越小越越透明，取值为[0,1]
  }

  .tips {
    font-size: 14px;
    color: #7631fd;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
