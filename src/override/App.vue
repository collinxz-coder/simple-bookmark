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
                            谷歌
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
    </div>
</template>

<script>
    import Storage from "../utils/Storage";
    import SearchEngine from "../utils/SearchEngine";
    import RemoteImages from "../utils/RemoteImages";
    export default {
        name: "App.vue",
        data() {
            return {
                bg_img_url: '',     // 背景图片地址
                img_type: '',
                search_key: '',
                engine_icon: '',
                img_offset: null,      // 背景图片偏移量
                engines: Object.values(SearchEngine),
                openNewTab: false,
            }
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
            }
        },

        mounted() {
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
            }
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
</style>