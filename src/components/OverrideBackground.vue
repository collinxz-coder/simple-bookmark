<template>
  <div>
    <div class="web_bg" :style="{backgroundImage: 'url(' + bg_img_url + ')'}"></div>

    <div class="footer-bar">
      <p>
        <a class="change-bg" @click="prev_bg">上一张壁纸</a>
        <a class="change-bg" @click="next_bg">下一张壁纸</a>
      </p>
    </div>
  </div>
</template>

<script>
  import RemoteImages from "../utils/RemoteImages";
  import Storage from "../utils/Storage";

  export default {
    name: "OverrideBackground",
    data() {
      return {
        img_type: '',
        bg_img_url: '',     // 背景图片地址
        img_offset: null,      // 背景图片偏移量
      }
    },

    methods: {
      // 下一张图片
      next_bg() {
        this.img_offset ++;

        RemoteImages.getImgUrl(this.img_type, this.img_offset).then(res => {
          this.bg_img_url = res;
        }).catch( _ => {} );
      },

      // 下一张图片
      prev_bg() {
        this.img_offset --;
        RemoteImages.getImgUrl(this.img_type, this.img_offset).then(res => {
          this.bg_img_url = res;
        }).catch( _ => {} );
      },

      // 获取图片
      getImage() {
        RemoteImages.getImgUrl(this.img_type, this.img_offset).then(value => {
          this.bg_img_url = value;

          Storage.get('offset_' + this.img_type + '_time').then(time => {
            if ((Date.parse(new Date()) / 1000 - time) > 86400) {
              console.log("自增");
              this.img_offset++;
            }
          }).catch(err => {});
        }).catch(err => { });
      },
    },

    mounted() {
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
