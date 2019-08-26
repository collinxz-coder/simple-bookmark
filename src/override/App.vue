<template>
    <div class="container">
        <div class="web_bg" :style="{backgroundImage: 'url(' + bg_img_url + ')'}"></div>

        <div class="content">
            <div class="search-box">
                <img v-if="engine_icon" :src="engine_icon" class="engine-icon" />
                <input type="text" class="search-input" v-model="search_key" @keyup.enter="search" autofocus />
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
    // import search engine icon.
    import '../../src/assets/images/baidu.png';
    import '../../src/assets/images/google.png';
    import '../../src/assets/images/geekband.png';
    import '../../src/assets/images/bing.png';
    import '../../src/assets/images/duckduckgo.png';

    import axios from 'axios';
    export default {
        name: "App.vue",
        data() {
            return {
                bg_img_url: '',     // 背景图片地址
                img_type: '',
                search_key: '',
                engine_icon: '',
            }
        },

        methods: {
            /**
             * Switch to the next image
             */
            next_bg() {
                chrome.storage.sync.get(['offset_' + this.img_type], res => {
                    let offset = res['offset_' + this.img_type] ? res['offset_' + this.img_type] : 1;
                    offset++;

                    let url = "http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=" + this.img_type + "&start=" + offset + "&count=1";
                    axios.get(url).then(res => {
                        let data = res.data;

                        if (data.errno != 0) return false;
                        if (data.data.length <= 0) return false;
                        data = data.data[0];
                        if (!data.url) return false;

                        this.bg_img_url = data.url;
                        this.increaseThisTypeOffset();
                    })
                });
            },
            /**
             * Switch to the previous image
             */
            prev_bg() {
                chrome.storage.sync.get(['offset_' + this.img_type], res => {
                    let offset = res['offset_' + this.img_type] ? res['offset_' + this.img_type] : 1;
                    offset--;

                    let url = "http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=" + this.img_type + "&start=" + offset + "&count=1";
                    axios.get(url).then(res => {
                        let data = res.data;

                        if (data.errno != 0) return false;
                        if (data.data.length <= 0) return false;
                        data = data.data[0];
                        if (!data.url) return false;

                        this.bg_img_url = data.url;
                        this.minusThisTypeOffset();
                    })
                });
            },

            /**
             * 搜索
             */
            search() {
                chrome.storage.sync.get(['engine_value'], res => {
                    if (! res.engine_value) {
                        return false;
                    }

                    let engine = res.engine_value;
                    let url = engine.replace("%s", this.search_key);

                    // // create a new tab
                    // chrome.tabs.create({
                    //     url: url,
                    //     active: true,
                    // })

                    chrome.tabs.getCurrent(tab => {
                        let tab_id = tab.id;
                        chrome.tabs.update(tab_id, {
                            url: url,
                            active: true,
                        })
                    })
                });
            },

            /**
             * get current image type.
             */
            getCurrentImgType() {
                chrome.storage.sync.get(['image_type'], res => {
                    if (res.image_type) {
                        this.img_type = res.image_type;
                    }
                })
            },

            /**
             * get remote background img.
             */
            getBackgroundImg() {
                chrome.storage.sync.get(['offset_' + this.img_type], res => {
                    let offset = res['offset_' + this.img_type] ? res['offset_' + this.img_type] : 1;

                    let url = "http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=" + this.img_type + "&start=" + offset + "&count=1";
                    axios.get(url).then(res => {
                        let data = res.data;

                        if (data.errno != 0) return false;
                        if (data.data.length <= 0) return false;

                        data = data.data[0];
                        if (data.url) {
                            this.bg_img_url = data.url;
                            chrome.storage.sync.get(['offset_' + this.img_type + '_time'], time => {
                                if (! time['offset_' + this.img_type + '_time']) {
                                    this.increaseThisTypeOffset();
                                } else if ((Date.parse(new Date()) / 1000 - time['offset_' + this.img_type + '_time']) > 86400) {
                                    this.increaseThisTypeOffset();
                                }
                            })
                        }
                    })
                });
            },

            increaseThisTypeOffset() {
                let key = 'offset_' + this.img_type;
                chrome.storage.sync.get([key], res => {
                    if (res[key]) {
                        chrome.storage.sync.set({[key]: res[key] + 1, [key + '_time' ]: Date.parse(new Date()) / 1000 });
                    } else {
                        // 如果没有找到，则初始化为1
                        chrome.storage.sync.set({[key]: 1, [key + '_time' ]: Date.parse(new Date()) / 1000 });
                    }
                })
            },

            minusThisTypeOffset() {
                let key = 'offset_' + this.img_type;
                chrome.storage.sync.get([key], res => {
                    if (res[key]) {
                        chrome.storage.sync.set({[key]: res[key] - 1, [key + '_time' ]: Date.parse(new Date()) / 1000 });
                    } else {
                        // 如果没有找到，则初始化为1
                        chrome.storage.sync.set({[key]: 1, [key + '_time' ]: Date.parse(new Date()) / 1000 });
                    }
                })
            },
        },

        mounted() {
            // get engine icon.
            chrome.storage.sync.get(['engine_icon'], res => {
                if (res.engine_icon) {
                    this.engine_icon = "/images/" + res.engine_icon;
                }
            });
            this.getCurrentImgType();
        },

        watch: {
            img_type: function(value) {
                this.getBackgroundImg();
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
        margin: 100px auto 0 auto;
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
    }
    .search-input {
        flex: 1;
        outline: none;
        border: none;
        font-size: 14px;
        font-weight: bold;
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
        height: 35px;
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
</style>