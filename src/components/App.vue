<template>
    <div class="" id="app">
        <header class="navbar is-primary"  v-if="groupId">
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
        <main class="section"  v-if="groupId">
            <div class="container">
                <div class="columns is-tablet">
                    <section class="column is-half-tablet is-one-third-desktop">
                        <div class="card">
                            <div class="card-content">
                                <h2 class="title">Add Character</h2>
                                <io-form v-bind:characters="characters"></io-form>
                            </div>
                        </div>

                    </section>
                    <section
                             class="column is-half-tablet is-two-thirds-desktop">
                        <div class="card shadow-sm">
                            <div class="card-content is-clearfix">
                                <h2 class="title">Initiative Order 
                                </h2>
                                <em v-if="!currentRound.length && !nextRound.length"
                                    class="text-muted">Add a character to get
                                    started</em>
                                <io-list v-if="!loading && currentRound.length"
                                         round="current"
                                         v-bind:characters="currentSorted"></io-list>
                                <io-list v-if="!loading && nextRound.length"
                                         round="next"
                                         v-bind:characters="nextSorted"></io-list>
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
    import login from './login.vue';
    import loading from './loading.vue';
    import ioList from './ioList.vue';
    import ioForm from './ioForm.vue';


    export default {
        components: {
            "login": login,
            "loading": loading,
            "io-list": ioList,
            "ioForm": ioForm
        },
        props: ['groupId', 'characters','loading'],

        computed: {
            currentRound: function(){
                return _.filter(this.characters, function(c){return c.round === 'current'});
            },
            nextRound: function () {
                return _.filter(this.characters, function (c) { return c.round === 'next' });
            },
            charsByName: function (round) {
                return _.orderBy(this[round], 'name', 'asc')
            },
            currentSorted: function () {
                var current = this.currentRound;
                return _.orderBy(current, 'score', 'desc')
            },
            nextSorted: function () {
                var next = this.nextRound;
                return _.orderBy(next, 'score', 'desc')
            }
        },

        methods: {
            resetRound: function () {
               this.$emit('reset');
            }
        }
    }
</script>

<style>
    @import "../style/normalize.css";
    @import "../../node_modules/bulma/css/bulma.css";
    @import "../style/main.css";
</style>