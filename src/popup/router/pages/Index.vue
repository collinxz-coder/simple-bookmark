<template>
  <div class="container">
    <div class="menu">
      <a @click="logout">退出登录</a>
    </div>
    <div style="margin-top: -30px">
      <ModifyBookMark ></ModifyBookMark>
    </div>
  </div>
</template>

<script>
  import ModifyBookMark from "../../../components/ModifyBookMark";
  export default {
    components: {ModifyBookMark},
    data() {
      return {}
    },

    methods: {
      logout() {
        this.$store.dispatch('logout');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    background: #323639;
    width: 512px;
  }

  .menu {
    text-align: right;
    padding: 10px;
  }
  .menu a {
    color: #FFFFFF;
    cursor: pointer;
  }
</style>
