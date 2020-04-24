<template>
    <div class="container">
        <div class="columns is-tablet">
            <section class="column is-half-tablet is-one-third-desktop">
                <div class="card">
                    <div class="card-content">
                        <h2 class="title">Add Character</h2>
                      <form-errors v-if="errors.length" v-bind:errors="errors"></form-errors>
                      <io-form v-bind:characters="allCharacters" @validation="handleErrors" @newchar="addChar"></io-form>
                    </div>
                </div>

            </section>
            <section class="column is-half-tablet is-two-thirds-desktop">
                <div class="card shadow-sm">
                    <div class="card-content is-clearfix">
                        <h2 class="title">Initiative Order</h2>
                        <em v-if="!currentRound.length && !nextRound.length"
                            class="text-muted">Add a character to get
                            started</em>
                        <init-list v-if="!loading && currentRound.length"
                                   round="current"
                                   v-bind:characters="currentSorted"
                                   @removed="removeChar"
                                   @take-turn="takeTurn"></init-list>
                        <init-list v-if="!loading && nextRound.length"
                                   round="next"
                                   v-bind:characters="nextSorted"
                                   @removed="removeChar"></init-list>
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
</template>

<script>
    import loading from './loading.vue';
    import initList from './initList.vue';
    import ioForm from './ioForm.vue';
    import formErrors from './formErrors.vue';

    export default {
        components: {
            "loading": loading,
            "init-list": initList,
            "ioForm": ioForm,
            "form-errors":formErrors
        },
        data: function () {
            return {
                formEntry: {
                    name: '',
                    score: '',
                    npc: false
                },
                currentRound: [],
                nextRound: [],
                errors: [],
                loading: false

            }
        },

        computed: {
            charsByName: function (round) {
                return _.orderBy(this[round], 'name', 'asc')
            },
          currentSorted: function () {
                return _.orderBy(this.currentRound, 'score', 'desc')
            },
          nextSorted: function () {
                return _.orderBy(this.nextRound, 'score', 'desc')
            },
          allCharacters: function(){
              return _.concat(this.nextRound, this.currentRound);
          }
        },

        methods: {
            handleErrors: function(isValidated, errors){
              this.isValidated = isValidated;
              
              if (errors){
                this.errors = errors;
              }
              else {
                this.errors = [];
              }
            },
            addChar: function (newChar) {
                    this.currentRound.push(newChar);
            },
            removeChar: function (char, round) {
                var key = round + 'Round';
                this[key] = _.filter(this[key], function (o) { return o.name !== char.name });
            },
            takeTurn: function (char) {
                this.nextRound.push(char);
                this.currentRound = _.filter(this.currentRound, function (o) { return o.name !== char.name });

                if (!this.currentRound.length && this.nextRound.length) {
                    this.loading = true;
                    var vm = this;
                    setTimeout(function () {
                        vm.resetRound();
                        vm.loading = false;
                    }, 1000);
                }
            },
            resetRound: function () {
                this.currentRound = _.concat(this.currentRound, this.nextRound);
                this.nextRound = [];
            }
        }
    }
</script>

<style>
    @import "../style/normalize.css";
    @import "../../node_modules/bulma/css/bulma.css";
    @import "../style/main.css";
</style>