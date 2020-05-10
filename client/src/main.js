//imports
import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

//vue configuration
Vue.config.productionTip = false;
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    groupId: null,
    characters: [],
    loading: false
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
      //if the reset is triggered automatically, use the loading component
      _.forEach(state.characters, function (char) {
        char.round = 'current';
      });
    }
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
  }
})

//adding custom filters
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//initialize app
new Vue({
  store: store,
  render: function (h) { return h(App) }
}).$mount('#app')
