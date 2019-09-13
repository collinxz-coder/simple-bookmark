<template>
  <div class="container">
    <OverrideBackground/>
    <SearchEngineComponent/>
    <bookmark/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Bookmark from "../components/Bookmark";
  import SearchEngineComponent from "../components/SearchEngineComponent";
  import OverrideBackground from "../components/OverrideBackground";

  export default {
    name: "App.vue",
    components: {Bookmark, SearchEngineComponent, OverrideBackground},

    computed: {
      ...mapGetters([
        'user',
      ])
    },

    mounted() {
      // 初始化用户信息
      this.$store.dispatch('getUserInfo');
    },

    watch: {
      user() {
        this.$store.dispatch("getBookClass");
        this.$store.dispatch("getBookMark");
      }
    }
  }
</script>

<style scoped>

</style>
