<!-- 添加/修改书签 -->
<template>
  <div class="container">
    <p class="title">{{ title }}</p>

    <div class="form-box">
      <div class="form-row">
        <label>名称</label>
        <input type="text" v-model="page_title" />
      </div>

      <div class="form-row">
        <label>网址</label>
        <input type="text" v-model="page_url" />
      </div>

      <el-tree v-loading="class_loading" :data="bookclass" class="book-class-tree" :props="{label: 'name'}" empty-text="" :check-on-click-node="true" :expand-on-click-node="false" @current-change="selectedNode">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i class="el-icon-folder" />
          {{ node.label }}
        </span>
      </el-tree>

      <div class="button-group">
        <button class="save-btn" @click="save">保存</button>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: "ModifyBookMark",
    props: {
      type: {
        type: String,
        default: "add"
      }
    },
    data() {
      return {
        title: "",
        class_loading: true,
        page_title: "",
        page_url: "",
        favIconUrl: "",
        current_node: null
      }
    },

    computed: {
      ...mapGetters([
        'bookclass'
      ])
    },

    mounted() {
      if (this.type == "add") {
        this.title = "添加书签";
      } else if (this.type == "update") {
        this.title = "修改书签";
      }

      chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        if (tab.length > 0) {
          this.page_title = tab[0].title;
          this.page_url = tab[0].url;
          this.favIconUrl = tab[0].favIconUrl;
        }
      })
    },

    methods: {
      selectedNode(data) {
        this.current_node = data;
      },

      /**
       * 添加书签
       */
      addBookMark() {
        let parent_id = 0;
        if (this.current_node) {
          parent_id = this.current_node.id;
        }

        let data = {
          class_id: parent_id,
          name: this.page_title,
          url: this.page_url,
          success: () => {
            // this.$notify({ title: "添加成功", message: "添加书签成功", type: "success" })
            window.close();
          },
          error: (msg) => {
            this.$notify.error({ title: "发生错误", message: msg });
          }
        };

        this.$store.dispatch("addBookMark", data);
      },

      /**
       * 修改书签
       */
      updateBookMark() {

      },

      save() {
        if (this.type == "add") {
          this.addBookMark();
        }
      }
    },

    watch: {
      bookclass(val) {
        this.class_loading = false;
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 15px;
  }

  .title {
    font-size: 14px;
    color: #EEE;
    margin: 0;
  }

  .form-box {
    margin-top: 20px;
    width: 482px;
  }

  .form-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;
    align-items: center;
  }
  .form-row label {
    width: 50px;
    color: #EEE;
  }

  .form-row input {
    flex: 1;
    background: #1D1D1F;
    color: #EEE;
    border: none;
    height: 30px;
    outline: none;
    padding: 0 10px;
    border-radius: 2px;
  }

  .book-class-tree {
    background: #3C4043;
    height: 317px;
    border-radius: 2px;
    overflow: auto;

  }

  /deep/ .el-loading-mask {
    background: #3C4043;
  }
  /deep/ .is-current > .el-tree-node__content {
    background: #eee !important;
  }
  /deep/ .is-current > .el-tree-node__content .custom-tree-node {
    color: #3C4043;
  }

  /deep/ .el-tree-node__content:hover, /deep/ .el-tree-node:focus>.el-tree-node__content {
    background: #3C4043;
  }

  .custom-tree-node {
    color: #EEE;
  }

  .save-btn {
    width: 80px;
    height: 30px;
    background: #8AB4F8;
    color: #3C4043;
    outline: none;
    border-radius: 4px;
    border: none;
  }

  .button-group {
    text-align: right;
    margin-top: 25px;
  }

  .save-btn:active {
    background: #8BAED0;
  }
</style>
