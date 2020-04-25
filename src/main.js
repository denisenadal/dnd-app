
import _ from 'lodash';
import Vue from 'vue';
import App from './components/App.vue';
const PORT = process.env.PORT || 8080;

import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://localhost:' + PORT, {
  format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
})

import 'normalize.css';
import "bulma/css/bulma.css";

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})


var app = new Vue({
  template: '<app :group-id="groupId" :characters="characters" :loading="loading" @reset="resetRound"></app>',
  components: {
    App
  },
  data: function () {
    return {
      groupId: "",
      characters: [],
      loading: false
    };
  },
  methods: {
    resetRound: function (options) {
      //if the reset is triggered automatically, use the loading component
      if (options && _.get(options, 'auto')) {
        this.loading = true;
        var vm = this;
        setTimeout(function () {
          vm.resetRound();
          vm.loading = false;
        }, 1000);
      }
      _.forEach(this.characters, function (char) {
        char.round = 'current';
      });

        var message = {
          "type": "updateChars",
          "characters": this.characters
        };
        //send updated character list to server
        this.$socket.sendObj(message);
    }
  },
  beforeMount: function () {
    this.$options.sockets.onmessage = (msg) => {
      var message = JSON.parse(msg.data)

      switch (message.type) {
        case "joinedGroup":
          this.groupId = message.data.groupId;
          this.characters = message.data.characters;
          break;
        case "updatedChars":
          this.characters = message.data.characters;
          break;
        case "ping":
          //console.log('ping received');
          break;
        default:
        //do whatever
      }
    }
  }
}).$mount('#app');
