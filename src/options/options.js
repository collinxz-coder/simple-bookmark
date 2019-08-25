

import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import '../assets/style/common.css';
import 'element-ui/lib/theme-chalk/index.css';

/* eslint-disable no-new */
Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
})
