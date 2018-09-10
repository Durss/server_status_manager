import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import CSSPlugin from "gsap";
import VueI18n from 'vue-i18n';
import labels from '@/i18n/labels';

Vue.config.productionTip = false

const gsapPlugins = [
	CSSPlugin,
]

Vue.use(VueI18n);

let userLang:string = navigator.language || (<any>navigator)['userLanguage']; 
userLang = userLang.substr(0,2).toLowerCase();
const i18n = new VueI18n({
	locale: "en",//userLang,
	fallbackLocale: 'en',
	messages:labels,
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
