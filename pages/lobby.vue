<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col col-md-6">
        <h1>You can now join a game</h1>

        <hr />

        <label for>Enter a game pin</label>
        <input type="text" class="form-control" v-model.lazy="gamePin" />
        <button class="btn btn-primary mt-2" @click="joinGame">Join a game</button>
      </div>
    </div>
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

<style></style>
