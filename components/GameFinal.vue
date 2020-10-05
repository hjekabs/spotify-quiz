<template>
  <div class="h-100 w-100 d-flex flex-column align-items-center justify-content-center">
    <h1 class="text-primary">Game Over!</h1>
    <div v-for="(score, index) in getSortedScores" :key="score.id" class="text-center">
      <div v-if="index === 0">
        <span class="h3">
          <span>
            <img :src="getUserImageFromScore(score)" class="user-avatar" />
            {{ getUserFromScore(score) }}
          </span> you
          <span class="text-primary">WON</span>!
        </span>
        <br />
        <small>(Total score: {{ score.totalScore }})</small>
      </div>
      <hr />
      <div>
        <span v-if="index === 1">
          <img :src="getUserImageFromScore(score)" class="user-avatar" />
          {{ getUserFromScore(score) }} you came in {{ index + 1 }}nd
          <br />
          <small>(Total score: {{ score.totalScore }})</small>
        </span>
      </div>
      <div>
        <span v-if="index === 2">
          <img :src="getUserImageFromScore(score)" class="user-avatar" />
          {{ getUserFromScore(score) }} you came in {{ index + 1 }}rd
          <br />
          <small>(Total score: {{ score.totalScore }})</small>
        </span>
      </div>
      <div>
        <span v-if="index >= 3">
          <img :src="getUserImageFromScore(score)" class="user-avatar" />
          {{ getUserFromScore(score) }} you came in {{ index + 1 }}th
          <br />
          <small>(Total score: {{ score.totalScore }})</small>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'

function sortAnswers(obj) {
  return obj.sort((a, b) => parseFloat(b.totalScore) - parseFloat(a.totalScore))
}

export default {
  props: ['answers'],
  data() {
    return {
      userScore: {
        socketId: undefined,
        totalScore: 0
      },
      users: [],
      allScores: [],
      sortedScores: []
    }
  },
  computed: {
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
    },
    getSortedScores() {
      return sortAnswers(this.allScores)
    }
  },
  methods: {
    getUserFromScore(score) {
      return this.users
        .filter(user => {
          if (user.socketId === score.socketId) {
            return user
          }
        })
        .map(user => user.displayName)[0]
    },
    getUserImageFromScore(score) {
      return this.users
        .filter(user => {
          if (user.socketId === score.socketId) {
            return user
          }
        })
        .map(user => user.imageUrl)[0]
    }
  },
  mounted() {
    const gamePin = this.$route.query.id
    const self = this
    this.answers.forEach(answer => {
      if (answer.socketId === self.getUserSocket) {
        self.userScore.totalScore += answer.answer.score
      }
    })
    this.userScore.socketId = this.getUserSocket
    socket.emit('push-to-final-score', {
      userScore: self.userScore,
      pin: gamePin
    })

    socket.on('final-scores', function(msg) {
      const { scores, users } = msg
      self.allScores = scores
      self.users = users
    })
  }
}
</script>
