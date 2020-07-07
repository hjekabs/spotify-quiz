<template>
  <div>
      <h1>You can now join a game</h1>

      <hr>

        <label for="">Enter a game pin</label>
        <input type="text" v-model.lazy="gamePin">
        <p>You will join game: {{ gamePin }}</p>
        <button @click="joinGame">Join a game</button>

  </div>
</template>

<script>

import socket from '~/plugins/socket.io.js'
import {mapGetters} from "vuex";

export default {

    auth: false,

    data() {
        return {
            user: null,
            gamePin: null,
        }
    },

    computed: {
        ...mapGetters({
            getUsers: "getUsers"
        }),
        allUsers() {
            return this.users
        }
    },

    methods: {
        joinGame() {

            this.$router.push("/game?id=" + this.gamePin)
        }
    },

    mounted () {
        socket.emit("user-entered-lobby")
        socket.on("ready-users", function(users) {
            console.log("Here are all the ready")
            console.log(users)
        })
    },

    created() {
        socket.on("ready-users", function(users) {
            console.log(users)
        })
    }
}
</script>

<style>

</style>