<template>
  <div>
    <el-button class="menu" @click="drawer = true" type="primary" icon="el-icon-menu" circle></el-button>

    <el-drawer title="书签" :visible.sync="drawer" direction="ltr">
      <el-tree v-loading="class_loading" class="book-tree" :data="book_data" :props="{ label: 'name' }"
               :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <i class="el-icon-folder" v-if="data.type == 'dir'"/>
            <i class="el-icon-link" v-if="data.type == 'link' && data.icon == ''"/>
            <img class="link-icon" v-if="data.type == 'link' && data.icon != ''" :src="data.icon"/>
            <el-tooltip class="item" effect="dark" :content="node.label" placement="top-start">
              <el-button class="node-name-btn" type="text" @dblclick.native="openUrl(data)">
                {{ node.label }}
              </el-button>
            </el-tooltip>
          </span>
          <span>
            <el-button type="text" v-if="data.type == 'dir'" @click="addBookClass(data)">
              <i class="el-icon-plus btn-icon"/>
            </el-button>
            <el-button type="text" v-if="data.type == 'dir'" @click="deleteClass(data)">
              <i class="el-icon-minus btn-icon"/>
            </el-button>
            <el-button type="text" v-if="data.type == 'dir'" @click="modifyClass(data)">
              <i class="el-icon-edit btn-icon"></i>
            </el-button>
            <el-button type="text" v-if="data.type == 'link'" @click="deleteBookMark(data)">
              <i class="el-icon-minus btn-icon"/>
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-drawer>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {override_initial} from "../store/getters";

  export default {
    name: "Bookmark",
    data() {
      return {
        drawer: false,
        class_loading: true,
        book_data: [],
      }
    },

    computed: {
      ...mapGetters([
        'book_mark',
        'book_class',
        'override_initial'
      ]),
    },

    mounted() {

    },

    methods: {
      /**
       * 删除书签
       */
      deleteBookMark(data) {
        this.$confirm("是否删除书签？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch("deleteBookMark", {
            id: data.id,
            success: _ => this.$message({type: 'success', message: '删除成功'}),
            error: msg => this.$message({type: 'error', message: msg})
          })
        }).catch(_ => this.$message({type: 'info', message: '已取消删除'}));
      },
      /**
       * 跳转
       */
      openUrl(data) {
        if (data.type == "link") {
          chrome.tabs.create({url: data.url, active: true});
        }
      },
      // 添加分类
      addBookClass(data) {
        this.$prompt("请输入分类名称", "添加分类", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '请输入分类名称'
        }).then(({value}) => {
          this.$store.dispatch("addBookClass", {
            parent_id: data.id,
            name: value,
            success: _ => {
              this.$message({type: 'success', message: '添加分类成功'})
            },
            error: (msg) => {
              this.$message({type: 'error', message: msg})
            }
          });
        }).catch(e => {
          this.$message({type: 'error', message: e});
        })
      },

      /**
       * 删除分类
       * @param data
       */
      deleteClass(data) {
        if (data.id == 0) {
          return;
        }

        this.$confirm("是否删除此分类，在删除前，请确认当前分类下没有子分类和书签", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch("deleteBookClass", {
            id: data.id,
            success: _ => {
              this.$message({type: 'success', message: '删除成功'})
            },
            error: (msg) => {
              this.$message({type: 'error', message: msg})
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      /**
       * 修改分类.
       *
       * @param data
       */
      modifyClass(data) {
        if (data.id == 0) {
          return;
        }

        this.$prompt("输入分类名", "修改分类", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '请输入分类名称'
        }).then(({value}) => {
          this.$store.dispatch("modifyBookClass", {
            id: data.id,
            name: value,
            parent_id: data.parent_id,
            success: _ => {
              this.$message({type: 'success', message: '修改分类成功'})
            },
            error: msg => {
              this.$message({type: 'error', message: msg})
            }
          })
        }).catch(e => {
          this.$message({type: 'error', message: e});
        })
      }
    },

    watch: {
      override_initial(val) {
        if (val < 2) {
          return;
        }

        console.log(this.book_mark);
        let bookmark = JSON.parse(JSON.stringify(this.book_mark));
        let bookclass = JSON.parse(JSON.stringify(this.book_class));

        Object.keys(bookmark).map(mark_key => {
          let mark = bookmark[mark_key];
          mark.name = mark.mark_name;
          mark.type = 'link';

          bookclass[mark.class_id].children ?
            bookclass[mark.class_id].children.push(mark) :
            bookclass[mark.class_id].children = [mark];
        });


        Object.keys(bookclass).map(class_id => {
          let book_class = bookclass[class_id];
          book_class.type = 'dir';

          if (book_class.parent_id != 0) {
            bookclass[book_class.parent_id].children ?
              bookclass[book_class.parent_id].children.push(book_class) :
              bookclass[book_class.parent_id].children = [book_class];
          }
        });

        //
        let book_array = [];
        Object.keys(bookclass).map(class_id => {
          if (bookclass[class_id].parent_id == 0) {
            book_array.push(bookclass[class_id]);
          }
        });

        this.book_data = [{
          id: 0,
          name: "书签栏",
          type: 'dir',
          children: book_array
        }];

        this.class_loading = false;

        console.log(this.book_data);
      }
    }
  }
</script>


<style scoped>
  .menu {
    position: fixed;
    bottom: 50px;
    right: 30px;
  }

  /deep/ .el-drawer {
    background: #3C4043;
    color: #FFF;
  }

  /deep/ .el-drawer__body, /deep/ .el-drawer__header {
    color: #FFF;
  }

  /deep/ .el-drawer__body {
    padding-bottom: 20px;
    overflow: auto;
  }

  /deep/ .el-tree {
    background: #3C4043;
  }

  /deep/ .el-tree-node__content button {
    color: #FFF;
  }

  /deep/ .is-current > .el-tree-node__content {
    background: #eee !important;
    color: #3C4043;
  }

  /deep/ .is-current > .el-tree-node__content button {
    color: #3C4043;
  }

  /deep/ .el-tree-node__content:hover, /deep/ .el-tree-node:focus > .el-tree-node__content {
    background: #3C4043;
  }

  /deep/ .el-loading-mask {
    background: #3C4043;
  }

  .custom-tree-node {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  .link-icon {
    width: 10px;
    vertical-align: center;
  }

  /deep/ .is-current .btn-icon {
    color: #3C4043;
  }

  .btn-icon {
    color: #FFF;
  }

  .node-name-btn {
    /*max-width: 100px;*/
    overflow: hidden;
  }
</style>
