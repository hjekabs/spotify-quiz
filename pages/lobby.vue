<template>
  <div>
    <h1>You can now join a game</h1>

    <hr />

    <label for>Enter a game pin</label>
    <input type="text" v-model.lazy="gamePin" />
    <p>You will join game: {{ gamePin }}</p>
    <button @click="joinGame">Join a game</button>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import { mapGetters } from 'vuex'

export default {
  auth: false,

  data() {
    return {
      user: null,
      gamePin: null
    }
  },

  computed: {
    ...mapGetters({
      getUser: 'getUser'
    })
  },

  methods: {
    joinGame() {
      const self = this
      this.$router.push({
        path: `/game?id=${this.gamePin}`
      })
    }
  }
}
</script>

<style>
</style>