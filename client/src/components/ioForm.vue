<template>
    <form action=""
          @submit="addChar">
        <form-errors v-if="errors.length"
                     v-bind:errors="errors">
        </form-errors>
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
    import _ from 'lodash';
    import formErrors from './formErrors.vue';

    export default {
        components: {
            "form-errors": formErrors
        },
        data: function () {
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
            initChar: function (char) {
                return {
                    name: _.get(char, 'name', ''),
                    score: parseInt(_.get(char, 'score', false)) || '',
                    npc: _.get(char, 'npc', false),
                    round: "current"
                };
            },
            addChar: function (e) {
                e.preventDefault();
                this.validate();

                if (this.isValidated) {
                    var newChar = this.initChar(this.formEntry);
                    this.formEntry = this.initChar();
                    this.$refs.name.focus();

                    if (this.$socket) {
                        var newCharList = _.concat(this.characters, newChar);
                        var message = {
                            "type": "updateChars",
                            "characters": newCharList
                        };
                        //send updated character list to server
                        this.$socket.sendObj(message);
                    }
                    else{
                        this.$emit('addChar',newChar);
                    }
                }
            },
            validate: function () {
                this.errors = [];
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
                return;
            }
        },
        props: ["characters"]
    }
</script>

<style>

</style>