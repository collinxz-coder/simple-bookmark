import axios from 'axios';

export default class RemoteImages {

    /**
     * get remote image type list.
     *
     * @returns {Promise<unknown>}
     */
    static getImagesTypeList() {
        let url = 'http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome';

        return (new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                let data = res.data;
                if (data.errno == 0) {
                    resolve(data.data);
                } else {
                    reject(res);
                }
            }).catch(err => {
                reject(err);
            })
        }));
    }

    /**
     * 获取远程图片地址.
     * @param type
     * @param offset
     * @returns {Promise<unknown>}
     */
    static getImgUrl(type, offset) {
        let url = "http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=" + type + "&start=" + offset + "&count=1";
        axios.get(url).then(res => {

        });

        return (new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                let data = res.data;
                data.errno != 0 && reject();
                data.data.length <= 0 && reject();
                data = data.data[0];
                !data.url && reject();

                resolve(data.url);
            }).catch((err) => {
                reject(err);
            })
        }));
    }

}