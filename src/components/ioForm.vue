<template>
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
</template>

<script>
    export default {
        data: function(){
          return {
            newChar:
          };
        },
        methods: {
           addChar(){}
        }
    }
</script>

<style>

</style>