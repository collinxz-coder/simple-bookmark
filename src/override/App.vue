<template>
    <div class="container">
        <div class="web_bg" :style="{backgroundImage: 'url(' + bg_img_url + ')'}"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "App.vue",
        data() {
            return {
                bg_img_url: '',     // 背景图片地址
                img_type: '',
            }
        },

        methods: {
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
        },

        mounted() {
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
</style>