<template>
    <div class="container">
        <div class="web_bg" :style="{backgroundImage: 'url(' + bg_img_url + ')'}"></div>

        <div class="content">

             <p class="logo">
                 <img src="/images/bookmark.png" />
             </p>

            <div class="search-box">
                <el-dropdown @command="handleCommand" trigger="click">
                    <span class="el-dropdown-link">
                        <img v-if="engine_icon" :src="engine_icon" class="engine-icon" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item.key" v-for="item in engines">
                            <img :src="'/images/' + item.icon" class="engine-icon change-engine" />
                            {{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <input type="text" class="search-input" placeholder="搜你想要的" v-model="search_key" @keyup.enter="search" autofocus />
                <a @click="search"><i class="el-icon-search search-icon"></i></a>
            </div>
        </div>

        <div class="footer-bar">
            <p>
                <a class="change-bg" @click="prev_bg">上一张壁纸</a>
                <a class="change-bg" @click="next_bg">下一张壁纸</a>
            </p>
        </div>

        <el-button class="menu" @click="drawer = true" type="primary" icon="el-icon-menu" circle></el-button>
        <el-drawer title="书签" :visible.sync="drawer" direction="ltr">
            <el-tree :expand-on-click-node="false" :data="bookmark" node-key="id" :props="{label: 'name'}" @node-click="handleNodeClick" @node-contextmenu="contextMenu">
                <span slot-scope="{node, data}" class="tree-node">
                    <span>
                        <i class="el-icon-notebook-2" v-if="data.type == 'dir'" />
                        <img :src="getIcon(data.url)" v-else style="height: 15px; vertical-align: middle" />
                        {{ node.label }}
                    </span>

                </span>
            </el-tree>
        </el-drawer>

        <ul v-show="contextmenu" class="dir-contextmenu" :style="contextmenu_style" v-clickoutside="hideContextMenu">
            <li><el-button type="text" @click="addRootClass">添加根分类</el-button></li>
            <li v-if="context_type=='dir'"><el-button type="text" size="small" @click="addChildClass">添加子分类</el-button></li>
            <li v-if="context_type=='dir'"><el-button type="text" size="small">修改</el-button></li>
            <li v-if="context_type=='dir'"><el-button type="text" size="small">删除</el-button></li>
            <li v-if="context_type=='link'"><el-button type="text" size="small">修改</el-button></li>
            <li v-if="context_type=='link'"><el-button type="text" size="small">删除</el-button></li>
        </ul>
    </div>
</template>

<script>
    import Storage from "../utils/Storage";
    import SearchEngine from "../utils/SearchEngine";
    import RemoteImages from "../utils/RemoteImages";
    import { mapGetters } from 'vuex';
    import clickoutside from '../utils/clickoutside';

    export default {
        name: "App.vue",
        data() {
            return {
                drawer: false,
                bg_img_url: '',     // 背景图片地址
                img_type: '',
                search_key: '',
                engine_icon: '',
                img_offset: null,      // 背景图片偏移量
                engines: Object.values(SearchEngine),
                openNewTab: false,

                contextmenu: false,
                context_type: "dir",
                contextmenu_style: {
                    top: "0px",
                    left: "0px"
                },
                contextmenu_data: null,
            }
        },

        computed: {
            ...mapGetters([
              'user',
              'bookmark'
            ])
        },

        methods: {
            handleCommand(command) {
                let engine = SearchEngine[command];
                Storage.set({engine_name: engine.name, engine_value: engine.value, engine_icon: engine.icon});
                this.engine_icon = "/images/" + engine.icon;
            },

            next_bg() {
                this.img_offset ++;

                RemoteImages.getImgUrl(this.img_type, this.img_offset).then(res => {
                    this.bg_img_url = res;
                }).catch(err => {
                    // console.log(err);
                });
            },

            prev_bg() {
                this.img_offset --;
                RemoteImages.getImgUrl(this.img_type, this.img_offset).then(res => {
                    this.bg_img_url = res;
                }).catch(err => {
                    // console.log(err);
                });
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

            getImage() {
                RemoteImages.getImgUrl(this.img_type, this.img_offset).then(value => {
                    this.bg_img_url = value;

                    Storage.get('offset_' + this.img_type + '_time').then(time => {
                        if ((Date.parse(new Date()) / 1000 - time) > 86400) {
                            console.log("自增");
                            this.img_offset++;
                        }
                    }).catch(err => {});
                }).catch(err => {
                    console.log(err);
                    console.log("error");
                });
            },

            // 删除树节点
            node_delete() {
                console.log("删除树节点")
            },

            // 树节点被点击
            handleNodeClick(data) {
                if (data.type === "link") {
                    chrome.tabs.create({ url: data.url, active: true });
                }
            },

            getIcon(url) {
                let urlObject = new URL(url);
                return urlObject.origin + "/favicon.ico";
            },

            contextMenu(event, data) {
                this.contextmenu_style.top = (event.clientY - 20) + "px";
                this.contextmenu_style.left = (event.clientX - 10) + "px";
                this.context_type = data.type;
                this.contextmenu = true;
                this.contextmenu_data = data;
            },

            hideContextMenu() {
                this.contextmenu = false;
            },

            addBookClass(parent_id) {
                this.$prompt("请输入分类名称", "添加分类", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\w*/,
                    inputErrorMessage: "名称不能为空"
                }).then(({ value }) => {
                    this.$store.dispatch("addChildClass", {
                        parent_id: parent_id,
                        name: value,
                        success: () => {
                            this.$notify({
                                title: '成功',
                                message: '添加分类成功',
                                type: 'success'
                            });
                        }, error: (msg) => {
                            this.$notify.error({
                                title: '失败',
                                message: msg,
                            });
                        }
                    })
                }).catch(() => {
                    // cancel
                })
            },

            addChildClass() {
                if (! this.contextmenu_data) {
                    return false;
                }
                this.addBookClass(this.contextmenu_data.id);
            },

            addRootClass() {
                this.addBookClass(0);
            }
        },

        mounted() {
            // 初始化用户信息
            this.$store.dispatch('getUserInfo');

            Storage.get('engine_icon').then(res => {
                this.engine_icon = "/images/" + res;
            });

            Storage.get('onpen_new_tab').then(res => {
                this.openNewTab = res;
            });

            Storage.compulsoryGet('image_type').then(value => {
                this.img_type = value;
                return Storage.compulsoryGet('offset_' + value);
            }).then(value => {
                this.img_offset = value;
                this.getImage();
            }).catch(err => {
               if (! this.img_type) {
                   alert("请先选择喜欢的图片类型！！！");
               } else if(! this.img_offset) {
                   this.img_offset = 1;
                   Storage.set({
                       ['offset_' + this.img_type]: this.img_offset,
                       ['offset_' + this.img_type + '_time']: Date.parse(new Date()) / 1000
                   });
                   this.getImage();
               }
            });
        },

        watch: {
            /**
             * save the img offset to chrome storage.
             * @param value
             */
            img_offset: function (value, oldValue) {
                if (oldValue != null) {
                    console.log("value: ", value, "old_value: ", oldValue);
                    let offset_key = 'offset_' + this.img_type;
                    let time_key = offset_key + '_time';
                    Storage.set({[offset_key]: this.img_offset, [time_key]: Date.parse(new Date()) / 1000});
                }
            },

            user(val) {
                if (val.is_login) {
                    this.$store.dispatch("getBookClass");
                }
            },

            bookmark(val) {
                console.log(JSON.stringify(val));
            }
        },

        directives: {
            clickoutside
        }
    }
</script>

<style scoped>
    .web_bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
        zoom: 1;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center 0;
    }

    .content {
        margin: 180px auto 0 auto;
        /*background: rgba(255,255,255,0.5);*/
        max-width: 1000px;
        /*padding: 50px 0 50px 0;*/
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
    .engine-icon {
        height: 25px;
        vertical-align: middle;
    }
    .footer-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: row;
        color: #FFF;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
    }
    .change-bg {
        margin-right: 10px;
        cursor: pointer;
    }
    .change-engine {
        vertical-align: middle;
        margin-right: 10px;
    }
    .logo {
        text-align: center;
        margin-bottom: 60px;
    }
    .menu {
        position: fixed;
        bottom: 50px;
        right: 30px;
    }
    .tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .dir-contextmenu {
        background: #333;
        color: #FFF;
        padding: 0px;
        overflow: hidden;
        list-style: none;
        position: fixed;
        width: 100px;
        z-index: 9999;
        border: 1px solid #000;
        border-radius: 5px;
    }
    .dir-contextmenu li {
        flex: 1;
        padding: 0 20px;
    }
    .dir-contextmenu li:hover {
        background: cornflowerblue;
    }
    .dir-contextmenu button {
        color: #FFF;
    }
</style>
