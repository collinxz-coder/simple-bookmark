import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
import '../assets/style/common.css';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
