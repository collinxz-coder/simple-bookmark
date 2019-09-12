<template>
  <div class="content">
    <p class="logo">
      <img src="/images/bookmark.png"/>
    </p>

    <div class="search-box">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">
          <img v-if="engine_icon" :src="engine_icon" class="engine-icon"/>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="item.key" v-for="item in engines">
            <img :src="'/images/' + item.icon" class="engine-icon change-engine"/>
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <input type="text" class="search-input" placeholder="搜你想要的" v-model="search_key" @keyup.enter="search" autofocus/>
      <a @click="search"><i class="el-icon-search search-icon"></i></a>
    </div>
  </div>
</template>

<script>
  import SearchEngine from "../utils/SearchEngine";
  import Storage from "../utils/Storage";

  export default {
    name: "SearchEngineComponent",
    data() {
      return {
        search_key: '',
        engine_icon: '',
        engines: Object.values(SearchEngine),
        openNewTab: false,
      }
    },

    mounted() {
      Storage.get('engine_icon').then(res => {
        this.engine_icon = "/images/" + res;
      });

      Storage.get('onpen_new_tab').then(res => {
        this.openNewTab = res;
      });
    },

    methods: {
      handleCommand(command) {
        let engine = SearchEngine[command];
        Storage.set({engine_name: engine.name, engine_value: engine.value, engine_icon: engine.icon});
        this.engine_icon = "/images/" + engine.icon;
      },

      /**
       * 搜索
       */
      search() {
        Storage.get('engine_value').then(value => {
          let url = value.replace("%s", this.search_key);

          if (this.openNewTab) {
            chrome.tabs.create({
              url: url,
              active: true,
            })
          } else {
            chrome.tabs.getCurrent(tab => {
              let tab_id = tab.id;
              chrome.tabs.update(tab_id, {
                url: url,
                active: true,
              })
            });
          }
        });
      },
    }
  }
</script>

<style scoped>
  .content {
    margin: 180px auto 0 auto;
    /*background: rgba(255,255,255,0.5);*/
    max-width: 1000px;
    /*padding: 50px 0 50px 0;*/
  }

  .engine-icon {
    height: 25px;
    vertical-align: middle;
  }

  .change-engine {
    vertical-align: middle;
    margin-right: 10px;
  }

  .logo {
    text-align: center;
    margin-bottom: 60px;
  }

  .search-box {
    background: rgba(255,255,255,1);
    border-radius: 30px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 15px;
    box-shadow: 3px 3px 15px 1px #888;
  }
  .search-input {
    flex: 1;
    outline: none;
    border: none;
    font-size: 14px;
    margin-left: 10px;
  }
  .search-icon {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #858585;
    cursor: pointer;
  }
</style>
