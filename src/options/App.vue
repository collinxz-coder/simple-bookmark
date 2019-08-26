<template>
  <div class="option-container">
    <div class="panel">
      <div class="panel-title">
        <img src="../assets/images/logo.png" />
        <p>Simple Bookmark options</p>
      </div>

      <div class="panel-body">
        <el-row class="row">
          <el-col :span="6">
            <p class="option-title">搜索引擎：</p>
          </el-col>
          <el-col :span="18" style="text-align: right">
            <el-select class="option-select" v-model="search_engine" placeholder="请选择默认搜索引擎" @change="changeEngine">
              <el-option
                v-for="item in engines"
                :key="item.key"
                :label="item.name"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-row>

        <el-row class="row">
          <el-col :span="6">
            <p class="option-title">背景主题：</p>
          </el-col>
          <el-col :span="18" style="text-align: right">
            <el-select class="option-select" v-model="image_type" placeholder="请选择背景图片类型">
              <el-option
                v-for="item in img_types"
                :key="item.id"
                :label="item.name"
                :value="item.id" />

            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import RemoteImages from "../utils/RemoteImages";
import Storage from "../utils/Storage";
import SearchEngine from "../utils/SearchEngine";

export default {
  name: "App",

  data() {
    return {
      engines: Object.values(SearchEngine),
      search_engine: null,
      img_types: [],  // {id: "36", name: "4K专区", order_num: "110", tag: "", create_time: "2015-12-08 13:50:44"}
      image_type: null,
    }
  },
  mounted() {
    // get current engine type.
    Storage.get('engine_value').then(value => {
      this.search_engine = value;
    });

    // get current image type.
    Storage.get('image_type').then(value => {
      this.image_type = value;
    });

    // get background image type list.
    RemoteImages.getImagesTypeList().then(value => {
      this.img_types = value;
    }).catch(err => {
      alert("获取背景图片分类失败，请检查网络是否畅通");
    });
  },
  methods: {
    /**
     * change search engine.
     */
    changeEngine(value) {
      let selectItem = this.engines.filter((item) => {
        return item.value === value;
      });

      if (selectItem.length < 1) return;
      selectItem = selectItem[0];

      Storage.set({engine_name: selectItem.name, engine_value: value, engine_icon: selectItem.icon});
    },
  },
  watch: {
    /**
     * save the image_type to storage.
     *
     * @param value
     */
    image_type: (value) => {
      Storage.set({image_type: value});
    }
  }
};
</script>

<style scoped>
  .option-container {
    background-color: #F5F5F5;
    width: 100%;
    height: 100%;
    position: fixed;
  }
  .panel {
    width: 400px;
    background: #FFF;
    margin: 10px auto;
    border: 1px solid #D2DBED;
    font-size: 13px;
    padding: 10px;
    -webkit-box-shadow: #888 2px 2px 2px;
    border-radius: 5px;
  }
  .panel-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #D2DBED;
  }
  .panel-title img {
    width: 35px;
    height: 35px;
    margin-right: 20px;
  }
  .panel-title p {
    font-size: 17px;
    font-weight: bold;
  }
  .panel-body {
    padding: 0 10px;
  }
  .option-select {
    width: 200px;
    outline: none;
  }
  .row {
    margin-top: 10px;
  }
  /deep/ .el-input {
    height: 30px;
  }
  /deep/ .el-input__inner {
    height: 30px;
  }
  /deep/ .el-input__icon {
    line-height: 30px;
  }
  .option-title {
    padding: 0;
    margin: 6px 0;
  }
</style>
