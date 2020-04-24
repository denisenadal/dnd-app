<template>
    <div class="init-list">
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
                            v-bind:class="active(char)">👋
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
        methods: {
          removeChar: function (char) {
                this.$emit('removed', char, this.round)
            },
          takeTurn: function(char){
            this.$emit('take-turn', char)
          },
          active: function(char){
            if( this.round === "current" && _.indexOf(this.characters, char) === 0){
              return ""
            }
            return "is-invisible";
          }
        },
        props: ['round','characters']
    }
</script>

<style>

</style>