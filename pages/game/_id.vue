<template>
  <div>
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
      <li v-for="track in tracks" :key="track.id">{{ track.tracks }} belongs for track.socketId</li>
    </ul>

    <button @click="readyGame">start game</button>
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
      tracks: []
    }
  },

  computed: {
    ...mapGetters({
      getUser: 'getUser'
    })
  },

  methods: {
    readyGame() {
      console.log(this.users)
      const data = gameData(this.users)
      console.log(data)
      console.log(`clicked by user ${this.getUser.displayName}`)
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

<style>
</style>