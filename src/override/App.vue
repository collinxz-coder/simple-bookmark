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
            getBackgroundImg() {
                let url = "http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=" + this.img_type + "&start=1&count=1";
                axios.get(url).then(res => {
                    let data = res.data;

                    if (data.errno != 0) return false;
                    if (data.data.length <= 0) return false;

                    data = data.data[0];
                    if (data.url) {
                        console.log("123");
                        this.bg_img_url = data.url;
                    }
                })
            }
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