/**
 * chrome storage api.
 */
export default class Storage {
    /**
     * get value from chrome storage.
     *
     * if can not get the value, promise reject is returned.
     * @param key
     * @returns {Promise<unknown>}
     */
    static compulsoryGet(key) {
        return (new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], res => {
                if (res[key]) {
                    resolve(res[key]);
                }
                reject();
            })
        }));
    }

    /**
     * get value from chrome storage.
     *
     * without the promise reject.
     * @param key
     * @returns {Promise<unknown>}
     */
    static get(key) {
        return (new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], res => {
                if (res[key]) {
                    resolve(res[key]);
                }
            })
        }));
    }

    /**
     * set values to chrome storage.
     *
     * {key: value, key: value, ... }
     * @param obj
     */
    static set(obj) {
        chrome.storage.sync.set(obj);
    }
}