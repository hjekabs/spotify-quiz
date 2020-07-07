<template>
  <div>
      <h1>This is the lobby and should show logged in users:</h1>

      <hr>

      <ul>
          <li v-for="user in allUsers" :key="user.id">
              {{ user.display_name }} 
          </li>
      </ul>
  </div>
</template>

<script>

import socket from '~/plugins/socket.io.js'
import {mapGetters} from "vuex";

export default {

    

    auth: false,

    data() {
        return {
            users: [],
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

    mounted () {
        socket.emit("user-entered-lobby")
        socket.on("ready-users", function(users) {
            console.log("Here are all the ready users:")
            console.log(users)
        })
    },
}
</script>

<style>

</style>