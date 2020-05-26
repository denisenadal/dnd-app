//imports
import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import VueNativeSock from 'vue-native-websocket';
import App from './App.vue';
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

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
    addGroupId: function (state, id) {
      state.groupId = id;
    },
    addCharacter: function (state, char) {
      state.characters.push(char);
    },
    loadCharacterList: function (state, chars) {
      state.characters = chars;
    },
    removeCharacter: function (state, char) {
      let updated = _.filter(state.characters, function (c) { return c.name !== char.name });
      state.characters = updated;
    },
    takeTurn: function (state, char) {
      let updated = _.map(state.characters, function (c) {
        if (c.name === char.name) {
          c.round = "next";
        }
        return c;
      });
      state.characters = updated;
    },
    resetRound: function (state) {
      _.forEach(state.characters, function (char) {
        char.round = 'current';
      });
    },
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {
    handleRemoveCharacter: function (context, char) {
      context.commit('removeCharacter', char);
      if (context.getters.currentRound.length === 0) {
        context.state.loading = true;
        setTimeout(function () {
          context.commit('resetRound');
          context.state.loading = false;
        }, 1000);
      }
    },
    handleTakeTurn: function (context, char) {
      context.commit('takeTurn', char);
      if (context.getters.currentRound.length === 0) {
        context.state.loading = true;
        setTimeout(function () {
          context.commit('resetRound');
          context.state.loading = false;
        }, 1000);
      }
    },
    handleSocketUpdate: function (context, changeSet) {
      //send change to server
      Vue.prototype.$socket.send(message);
      this.$options.sockets.sendObj({ some: data })
      //message from server should update local list
    }
  }
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
  beforeMount: function () {
    this.$options.sockets.onmessage = (msg) => {
      var message = JSON.parse(msg.data)

      switch (message.type) {
        case "joinedGroup":
          this.$store.commit('addGroupId', message.data.groupId);
          this.$store.commit('loadCharacterList', message.data.characters);
          break;
        case "addChar":
          this.$store.commit('addCharacter', message.data.character);
          break;
        case "removeChar":
          this.$store.commit('removeCharacter', message.data.character);
          break;
        case "takeTurn":
          this.$store.commit('takeTurn', message.data.character);
          break;
        case "updatedChars":
          this.$store.commit('loadCharacterList', message.data.characters);
          break;
        case "ping":
          console.log('ping received');
          break;
        default:
        //do whatever
      }
    }


  }
}).$mount('#app')
