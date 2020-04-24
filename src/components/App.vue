<template>
    <div class="container">
        <div class="columns is-tablet">
            <section class="column is-half-tablet is-one-third-desktop">
                <div class="card">
                    <div class="card-content">
                        <h2 class="title">Add Character</h2>
                      <form-errors v-if="errors.length" v-bind:errors="errors"></form-errors>

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
            }
        },

        methods: {
            initChar: function (char) {
                return {
                    name: _.get(char, 'name', ''),
                    score: parseInt(_.get(char, 'score', false)) || '',
                    npc: _.get(char, 'npc', false),
                };
            },
            validate: function () {
                this.errors = [];
                if (this.formEntry.name && this.formEntry.score) {
                    var name = this.formEntry.name
                    if (_.find(this.currentRound, function (o) { return o.name === name })) {
                        this.errors.push('Name must be unique');
                        this.isValidated = false;

                    }
                    else {
                        this.isValidated = true;

                    }
                }
                else {
                    if (!this.formEntry.name) {
                        this.errors.push('Character name required');
                    }
                    if (!this.formEntry.score) {
                        this.errors.push('Initiative score required');
                    }
                    this.isValidated = false;
                }
                return;
            },
            addChar: function (e) {
                e.preventDefault();
                this.validate();

                if (this.isValidated) {
                    var newChar = this.initChar(this.formEntry);
                    this.currentRound.push(newChar);
                    this.formEntry = this.initChar();
                    this.$refs.name.focus();
                }
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