<template>
  <div>
    <div v-if="game.loadStatus === 'INITIAL'">
      <h1>This is the game lobby</h1>

      <p>Users in this game lobby:</p>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.displayName }}
          with socketId {{ user.socketId }}
        </li>
      </ul>

      <p>Tracks:</p>
      <ul>
        <li v-for="track in tracks" :key="track.id">
          {{ track.tracks }} belongs for track.socketId
        </li>
      </ul>

      <button @click="readyGame">start game</button>
    </div>
    <div v-else-if="game.loadStatus === 'LOADING'">
      Setting up the game, please wait...
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="game.loadStatus === 'GETREADY'">
      {{ game.startTimer }}
    </div>
    <div v-else-if="game.loadStatus === 'START'">
      <h1>GAME should start now</h1>
      <b></b>
      {{ tracks }}
    </div>
  </div>
</template>

<script>
function filterSongs() {}

import socket from '~/plugins/socket.io.js'
import { mapGetters } from 'vuex'
import { gameData } from '~/utils/game.js'

export default {
  data() {
    return {
      users: [],
      tracks: [],
      game: {
        loadStatus: 'INITIAL',
        startTimer: 3
      }
    }
  },

  computed: {
    ...mapGetters({
      getUser: 'getUser'
    })
  },

  methods: {
    readyGame() {
      this.game.loadStatus = 'LOADING'
      this.tracks = gameData(this.users)

      if (this.tracks.length) {
        this.game.loadStatus = 'GETREADY'

        const self = this
        const decrementTimer = setInterval(() => {
          if (self.game.startTimer === 1) {
            clearInterval(decrementTimer)
            self.game.loadStatus = 'START'
          }
          self.game.startTimer--
        }, 1000)
      }
    }
  },

  mounted() {
    const gamePin = this.$route.query.id
    const self = this
    socket.emit('user-joined-game', {
      pin: gamePin,
      user: self.getUser
    })

    socket.on('game-ready-users', function(msg) {
      console.log(msg)
      const { user, allUsers, socketId } = msg
      self.users = allUsers
      self.user = user
    })
  }
}
</script>

<style></style>
