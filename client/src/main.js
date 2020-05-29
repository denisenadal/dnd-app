import Vue from 'vue'
import App from './App.vue'
import _ from 'lodash';

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})


new Vue({
  render: function (h) { return h(App) }
}).$mount('#app')
