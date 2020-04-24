<template>
    <div id="app" class="container">
        <div class="columns is-tablet">
            <section class="column is-half-tablet is-one-third-desktop">
                <div class="card">
                    <div class="card-content">
                        <h2 class="title">Add Character</h2>
                        <div v-if="errors.length"
                                class="message is-danger">
                            <p class="message-body content">
                                <strong>Please correct the following
                                    error(s):</strong>
                                <ul>
                                    <li v-for="error in errors">
                                        {{ error }}</li>
                                </ul>
                            </p>
                        </div>
                        <form action=""
                                @submit="addChar">
                            <div class="field">
                                <label class="label"
                                        for="name">Character Name</label>
                                <div class="control">
                                    <input v-model="formEntry.name"
                                            type="text"
                                            placeholder="enter a name"
                                            class="input"
                                            name="name"
                                            id="name"
                                            ref="name"
                                            autofocus />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label"
                                        for="score">Initiative
                                    Score</label>
                                <div class="control">
                                    <input v-model="formEntry.score"
                                            type="text"
                                            placeholder="enter a number"
                                            class="input"
                                            name="score"
                                            id="score"
                                            autocomplete="false" />
                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control is-expanded">
                                    <label class="checkbox"
                                            for="npc">
                                        <input type="checkbox"
                                                id="npc"
                                                name="npc"
                                                v-model="formEntry.npc">
                                        NPC?</label>
                                </div>
                                <div class="control text-right">
                                    <input value="add"
                                            type="submit"
                                            class="button is-primary">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </section>
            <section class="column is-half-tablet is-two-thirds-desktop">
                <div class="card shadow-sm">
                    <div class="card-content is-clearfix"
                         v-if="!loading">
                        <h2 class="title">Initiative Order</h2>
                        <em v-if="!currentRound.length && !nextRound.length"
                            class="text-muted">Add a character to get
                            started</em>
                    
                        <div v-if="currentRound.length">
                            <h3 class="subtitle is-marginless">Current
                                Round</h3>
                            <ul class="">
                                <li v-for="(char,index) in currentRoundSorted"
                                    class="level is-marginless"
                                    v-bind:class="{ 'has-text-danger': char.npc }">
                                    <strong class="level-left">{{char.name}}</strong>
                                    <div class="level-right">
                                        <span class="level-item">{{char.score}}</span>
                                        <span class="level-item"></span>
                                        <button class="level-item"
                                                aria-label="delete"
                                                v-on:click="removeChar(char)">
                                            ⛔️</button>
                                        <button class="button level-item  is-primary is-outlined "
                                                v-on:click="takeTurn(char)"
                                                v-bind:class="{'is-invisible': index !== 0}">👋
                                            Take
                                            Turn</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div v-if="nextRound.length">
                            <h3 class="subtitle is-marginless">Next
                                Round</h3>
                            <ul class="">
                                <li v-for="char in nextRoundSorted"
                                    class="level is-marginless"
                                    v-bind:class="{ 'has-text-danger': char.npc }">
                                    <strong class="level-left">{{char.name}}</strong>
                                    <div class="level-right">
                                        <span class="level-item">{{char.score}}</span>
                                        <span class="level-item"></span>
                                        <button class="level-item"
                                                aria-label="delete"
                                                v-on:click="removeChar(char)">
                                            ⛔️</button>
                                        <button
                                                class="button level-item  is-primary is-outlined is-invisible">👋
                                            Take
                                            Turn</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <button class="button  is-pulled-right"
                                v-if="currentRound.length && nextRound.length"
                                v-on:click="resetRound()">Reset
                            Round 💫</button>
                    </div>
                    <div class="card-content has-text-centered"
                         v-if="loading">
                        <loading></loading>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import loading from 'loading.vue';
    import initList from 'initList.vue';
    import initListItem from 'initListItem.vue';

    export default {
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
            currentRoundSorted: function () {
                return _.orderBy(this.currentRound, 'score', 'desc')
            },
            nextRoundSorted: function () {
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
            removeChar: function (char) {
                this.currentRound = _.filter(this.currentRound, function (o) { return o.name !== char.name });
                this.nextRound = _.filter(this.nextRound, function (o) { return o.name !== char.name });
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