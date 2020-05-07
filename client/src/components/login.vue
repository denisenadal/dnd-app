<template>
    <section class="hero is-medium is-primary is-bold">
        <div class="hero-body is-centered">
            <h1 class="title is-1">DND Party Initiative Tracker</h1>
            <div class="container"
                 v-if="!join">
                <button class="button is-danger is-medium is-rounded"
                        v-on:click="startRound()">
                    Start New Round
                </button>
                <button class="button is-outlined is-light is-medium is-rounded"
                        v-on:click="toggleJoin()">
                    Join Existing Round
                </button>
            </div>
            <div class="container"
                 v-if="join">
                <div class="field has-addons">
                    <div class="control">
                        <button class="button "
                                v-on:click="toggleJoin()">◂ Back</button>
                    </div>
                    <div class="control">
                        <input v-model="requested"
                               type="text"
                               placeholder="enter your group's round ID #"
                               class="input"
                               name="requestedID"
                               id="requestedID"
                               autocomplete="off" />
                    </div>
                    <div class="control">
                        <button class="button is-danger"
                                v-on:click="startRound(true)">Join ✨</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        name: "login",
        data: function () {
            return {
                requested: null,
                join: false
            };
        },
        methods: {
            toggleJoin: function () {
                this.join = !this.join;
            },
            startRound: function (joinGroup) {
                if(this.$socket){
                let id = joinGroup ? this.requested : null;
                    var message = {
                        "type": "joinRequest",
                        "groupId": id
                    };
                    //send request to start/join round to server
                    this.$socket.sendObj(message);
                }
                else {
                    let id = joinGroup ? this.requested : 1000;
                    this.$emit('join',id);
                }
            }
        }
    }
</script>

<style>
</style>