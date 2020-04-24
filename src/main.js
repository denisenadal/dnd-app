import Vue from 'vue'
import App from './components/App.vue'
import _ from 'lodash'

import normalize from 'normalize.css'
import "bulma/css/bulma.css";



var app = new Vue({
  template: '<app></app>',
  components: {
    App
  },
  el: '#app'
});
