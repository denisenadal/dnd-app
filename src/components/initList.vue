<template>
    <div class="card-content is-clearfix">
        <h3 class="subtitle is-marginless">{{ round| capitalize}}
            Round</h3>
        <ul class="">
            <li v-for="(char,index) in charactersSorted"
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
</template>

<script>
    export default {
        name: "init-list",
        computed: { 
             charactersSorted: function () {
                return _.orderBy(this.characters, 'score', 'desc')
            }
        },
        methods: {
            removeChar: function (char) {
                this.$emit('removed', char, this.round)
            },
          takeTurn: function(char){
            this.$emit('take-turn', char)
          }
        },
        props: ['round','characters']
    }
</script>

<style>

</style>