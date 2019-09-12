<template>
  <div class="container">
    <ModifyBookMark ></ModifyBookMark>
  </div>
</template>

<script>
  import ModifyBookMark from "../../../components/ModifyBookMark";
  export default {
    components: {ModifyBookMark},
    data() {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    background: #323639;
    width: 512px;
  }
</style>
