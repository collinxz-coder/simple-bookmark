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
import axios from 'axios';

export default {
  name: "App",

  data() {
    return {
      engines: [{
        key: 'baidu',
        name: '百度',
        value: 'https://www.baidu.com/s?wd=%s'
      }, {
        key: 'google',
        name: '谷歌',
        value: 'https://www.google.com/search?q=%s'
      },{
        key: 'bing',
        name: '必应',
        value: 'https://cn.bing.com/search?q=%s',
      },{
        key: 'duckduckgo',
        name: 'DuckDuckGo',
        value: 'https://duckduckgo.com/?q=%s',
      },{
        key: 'geekband',
        name: '极客搜索',
        value: 'https://s.geekbang.org/search/c=0/k=%s/t='
      }],
      search_engine: null,
      img_types: [],  // {id: "36", name: "4K专区", order_num: "110", tag: "", create_time: "2015-12-08 13:50:44"}
      image_type: null,
    }
  },
  mounted() {
    this.getCurrentImgType();
    this.getCurrentSearchEngine();
    this.getImgTypeList();
  },
  methods: {
    /**
     * change search engine.
     */
    changeEngine(value) {
      let engine_name = "";
      this.engines.map((item, index) => {
        if (item.value === value) {
          engine_name = item.name;
        }
      });

      chrome.storage.sync.set({engine_name: engine_name, engine_value: value}, () => {
        // success.
      })
    },

    /**
     * get remote image type list.
     */
    getImgTypeList() {
      let url = 'http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome';

      axios.get(url).then(res => {
          let data = res.data;
          if (data.errno == 0) {
            this.img_types = data.data;
          }
      });
    },

    /**
     * get current image type.
     */
    getCurrentImgType() {
      chrome.storage.sync.get(['image_type'], result => {
        if (result.image_type) {
          this.image_type = result.image_type;
        }
      })
    },

    /**
     * get current search engine.
     */
    getCurrentSearchEngine() {
      chrome.storage.sync.get(['engine_value'], res => {
        if (res.engine_value)
          this.search_engine = res.engine_value;
      })
    }
  },
  watch: {
    /**
     * save the image_type to storage.
     *
     * @param value
     * @param oldValue
     */
    image_type: (value, oldValue) => {
      chrome.storage.sync.set({image_type: value}, () => {
        // success.
      });
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
