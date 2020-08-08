<template>
  <div class="container h-100">
    <div class="row justify-content-center h-100">
      <div class="col-12 col-md-8 d-flex flex-column justify-content-around">
        <div>
          <label class="h1 mb-2">Enter a game pin</label>
          <div class="row">
            <div class="col col-md-8">
              <input
                type="text"
                class="form-control pin-input h-100 w-100 p-5"
                v-model.lazy="gamePin"
                maxlength="8"
              />
            </div>
            <div class="col-12 col-md-4 mt-2 mt-md-0">
              <button
                class="btn btn-outline-primary h-100 w-100 join-button"
                @click="joinGame"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            class="btn p-3 btn-outline-primary mt-5 join-button"
            @click="generateGame"
          >
            Create a game
          </button>
        </div>
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
      const pin = this.gamePin
      this.$router.push({
        path: `/game?id=${pin}`
      })
    },
    generateGame() {
      const gamePin = Math.floor(Math.random() * 10000000)
      this.$router.push({
        path: `/game?id=${gamePin}&admin=true`
      })
    }
  }
}
</script>

<style></style>
