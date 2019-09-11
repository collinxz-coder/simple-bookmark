<template>
  <div style="padding: 10px 50px">
    <p class="logo">
      <img src="/images/bookmark.png"/>
    </p>

    <el-form :model="ruleForm" ref="form" :rules="rules" label-width="70px" size="mini" style="margin-left: -25px">
      <el-form-item label="邮箱" prop="email">
        <el-input  v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>

      <el-form-item style="margin-top: 10px">
        <el-button type="success" plain @click="login">登录</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          email: '',
          password: '',
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      }
    },

    methods: {
      login() {
        this.$refs["form"].validate(valid =>{
          if (valid) {
            this.$store.dispatch("loginByEmail", { email: this.ruleForm.email, password: this.ruleForm.password });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .logo img {
    width: 200px;
  }
</style>
