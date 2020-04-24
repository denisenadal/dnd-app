import Vue from 'vue'
import App from './components/App.vue'
import _ from 'lodash'

import normalize from 'normalize.css'
import "bulma/css/bulma.css";

import loading from './components/loading.vue';
import initList from './components/initList.vue';
import initListItem from './components/initListItem.vue';



var app = new Vue({
  template: '<app></app>',
  components: {
    App,
    loading,
    initList,
    initListItem
  },
  el: '#app'
});
