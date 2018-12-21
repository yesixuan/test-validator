import Vue from 'vue'
import validator from './plugins'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(validator)

new Vue({
  render: h => h(App),
}).$mount('#app')
