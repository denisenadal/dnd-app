//imports
import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import VueNativeSock from 'vue-native-websocket';
import App from './App.vue';
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'dnd.localhost';

//vue configuration
Vue.config.productionTip = false;
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    groupId: null,
    characters: [],
    loading: false,
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    }
  },
  getters: {
    allCharacters: function (state) {
      return state.characters;
    },
    currentRound: function (state) {
      let chars = _.filter(state.characters, function (c) { return c.round === 'current' });
      return _.orderBy(chars, 'score', 'desc')
    },
    nextRound: function (state) {
      let chars = _.filter(state.characters, function (c) { return c.round === 'next' });
      return _.orderBy(chars, 'score', 'desc')
    }
  },
  mutations: {
    SOCKET_addGroupId: function (state, message) {
      state.groupId = message.group.groupId;
      state.characters = [];
      state.characters = message.group.characters;
    },
    SOCKET_loading: function(state, message){
      state.loading = message.loading;
      setTimeout(function () {
        state.loading = false;
      }, 1000);
    },
    SOCKET_loadCharacterList: function (state, message) {
      state.characters = message.characters;
    },
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
      //console.log('connected');
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      let err = event.err ? event.err : "unspecified errors";
      alert(err);
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      //console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: { }
})

//init sockets
Vue.use(VueNativeSock, 'ws://' + HOST + ':' + PORT, {
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  store: store
});

//adding custom filters
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//initialize app
new Vue({
  store: store,
  render: function (h) { return h(App) },
  beforeMount: function () {}
}).$mount('#app')
