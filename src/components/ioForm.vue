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
            formEntry: {
                    name: '',
                    score: '',
                    npc: false
                },
            errors: [],
            isValidated: false
          };
        },
        methods: {
           addChar: function(){
             //validate
             //emit new char?
             //clear form
           },
          validate: function () {
                if (this.formEntry.name && this.formEntry.score) {
                    var name = this.formEntry.name
                    if (_.find(this.characters, function (o) { return o.name === name })) {
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
                this.$emit('validation', this.isValidated, this.errors);
                return;
            },
        },
      props: ["characters"]
    }
</script>

<style>

</style>