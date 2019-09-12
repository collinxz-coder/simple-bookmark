<template>
    <div>
        <router-view v-if="isLogin"></router-view>
        <router-view name="login" v-else></router-view>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        isLogin: false
      }
    },

    computed: {
      ...mapGetters([
        'user'
      ])
    },

    mounted() {
      this.$store.dispatch('getUserInfo');
    },

    watch: {
      user(val) {
        this.isLogin = val.is_login;
        if (val.is_login) {
            this.$store.dispatch("getClass");
        }
      }
    }
  }
</script>


