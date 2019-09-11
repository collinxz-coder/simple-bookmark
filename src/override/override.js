import Vue from 'vue';
import App from './App';
import store from "../store";
import ElementUI from 'element-ui';
import '../assets/style/common.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
