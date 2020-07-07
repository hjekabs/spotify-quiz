<template>
  <div>
      <h1>This is the game lobby</h1>


      <p>Users in this game lobby:</p>  
      <ul>
          <li v-for="user in users" :key="user.id">
            {{ user }}
          </li>
      </ul>


  </div>
</template>

<script>

import socket from '~/plugins/socket.io.js'
import {mapGetters} from "vuex";

export default {

  data() {
    return {
      users: [],
    }
  },

  computed: {
    ...mapGetters({
        getUser: "getUser"
    }),
  },

  mounted() {

    const gamePin = this.$route.query.id
    const self = this;
    socket.emit("user-joined-game", {
        pin: gamePin,
        user: self.getUser
    })

    socket.on("game-ready-users", function(msg) {
      console.log(msg)
      const {user, allUsers} = msg
      self.users = allUsers
    })
  }
}
</script>

<style>

</style>