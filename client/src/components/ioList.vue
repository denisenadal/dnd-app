<template>
  <div class="io-list">
    <h3 class="subtitle is-marginless">{{ round| capitalize}}
      Round</h3>
    <ul class="">
      <li v-for="char in characters"
          class="io-entry is-marginless"
          v-bind:class="{ 'has-text-danger': char.npc }">
        <strong class="io-name">{{char.name}}</strong>
        <p class="io-dt-item">{{char.score}}</p>
        <button class="io-dt-item button is-primary is-inverted"
                aria-label="delete"
                v-on:click="removeChar(char)">
          ⛔️</button>
        <button class="button io-dt-item is-primary is-outlined "
                v-on:click="takeTurn(char)"
                v-bind:class="active(char)">👋
          Take
          Turn</button>
      </li>
    </ul>
  </div>
</template>

<script>
  import _ from 'lodash';
  export default {
    name: "io-list",
    props: ['round'],
    computed: {
      characters() {
        let chars = this.round + 'Round';
        return this.$store.getters[chars];
      }
    },
    methods: {
      removeChar: function (char) {
        this.$store.dispatch('handleRemoveCharacter', char);
      },
      takeTurn: function (char) {
        this.$store.dispatch('handleTakeTurn', char);
      },
      active: function (char) {
        if (this.round === "current" && _.indexOf(this.characters, char) === 0) {
          return ""
        }
        return "is-invisible";
      }
    }
  }
</script>

<style>
  .io-list {
    margin-bottom: 3rem;
  }

  .io-entry {
    background-color: white;
    border-bottom: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 0;
    padding: 1rem .75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  .io-name {
    flex-grow: 1;
  }
</style>