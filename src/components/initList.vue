<template>
    <div class="card-content is-clearfix">
        <div v-if="currentRound.length">
            <h3 class="subtitle is-marginless">{{ round| capitalize}}
                Round</h3>
            <ul class="">
                <li v-for="(char,index) in characters"
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
                                v-bind:class="{'is-invisible': index !== 0 || round === 'current'}">👋
                            Take
                            Turn</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data:{ },
        computed: { },
        methods: {
            removeChar: function (char) {
                this.characters = _.filter(this.characters, function (o) { return o.name !== char.name });
            }
        },
        props: ['round','characters','takeTurn']
    }
</script>

<style>

</style>