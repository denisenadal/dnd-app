<template>
  <div class=""
       id="app">
    <header class="navbar is-primary"
            v-if="groupId">
      <div class="container">
        <div class="navbar-brand ">
          <h1 class="navbar-item title is-4">DND Initiative Tracker
          </h1>
        </div>
        <div class="navbar-end">
          <p class="navbar-item title is-4">Group #{{groupId}}</p>
        </div>
      </div>
    </header>
    <login v-if="!groupId"></login>

    <main class="section"
          v-if="groupId">
      <div class="container">
        <div class="columns is-tablet">
          <section class="column is-half-tablet is-one-third-desktop">
            <div class="card">
              <div class="card-content">
                <h2 class="title">Add Character</h2>
                <io-form></io-form>
              </div>
            </div>
          </section>
          <section class="column is-half-tablet is-two-thirds-desktop">
            <div class="card shadow-sm">
              <div class="card-content is-clearfix">
                <h2 class="title">Initiative Order
                </h2>
                <em v-if="!currentRound.length && !nextRound.length"
                    class="text-muted">Add a character to get
                  started</em>
                <io-list v-if="!loading && currentRound.length"
                         round="current">
                </io-list>
                <io-list v-if="!loading && nextRound.length"
                         round="next"></io-list>
                <button class="button  is-pulled-right"
                        v-if="currentRound.length && nextRound.length"
                        v-on:click="resetRound()">Reset
                  Round 💫</button>
                <div class="has-text-centered"
                     v-if="loading">
                  <loading></loading>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import login from './components/login.vue';
  import loading from './components/loading.vue';
  import ioList from './components/ioList.vue';
  import ioForm from './components/ioForm.vue';


  export default {
    components: {
      "login": login,
      "loading": loading,
      "io-list": ioList,
      "ioForm": ioForm
    },
    computed: {
      groupId() {
        return this.$store.state.groupId
      },
      characters() {
        return this.$store.state.characters
      },
      loading() {
        return this.$store.state.loading
      },
      currentRound: function () {
        return this.$store.getters.currentRound;
      },
      nextRound: function () {
        return this.$store.getters.nextRound;
      }
    },
    methods: {
      resetRound: function () {
        let message;
        //send to server
        if(this.$store.getters.currentRound.length > 1){
          message = { type: 'resetRound' }
        }
        else{
          message = { type: 'triggerReset' }
        }
        this.$socket.sendObj(message);
      }
    }
  }
</script>

<style lang="scss">
  @import "../node_modules/bulma/bulma.sass";

  html,
  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main.section,
  #app {
    flex-grow: 1;
  }

  .columns {
    align-items: stretch;
  }

  .highlight {
    background: rgba(255, 0, 0, 0.5);
    color: red;
  }

  .footer {
    padding: 1.5rem !important;
  }

  strong {
    color: inherit !important;
  }

  .card-content .subtitle {
    border-bottom: 2px solid rgba(0, 0, 0, 0.08);
    padding-bottom: 1.5rem;
  }
</style>