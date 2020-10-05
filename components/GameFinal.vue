<template>
  <div class="h-100 w-100">
    <h1 class="text-primary">Game Over!</h1>

    <div v-for="(score, index) in getSortedScores" :key="score.id">
      Congrats {{ getUserFromScore(score) }} you came in {{ index }}
    </div>
    
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'

function sortAnswers(obj) {
  return obj.sort((a, b) => parseFloat(b.totalScore) - parseFloat(a.totalScore));
}

export default {
  props: ['answers'],
  data() {
    return {
      userScore: {
        socketId: undefined,
        totalScore: 0,
      },
      users: [],
      allScores: [],
      sortedScores: [],
    }
  },
  computed: {
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
    },
    getSortedScores() {
      return sortAnswers(this.allScores)
    },
  },
  methods: {
    getUserFromScore(score) {
      return this.users.filter(user => {
        if(user.socketId === score.socketId) {
          console.log(user.displayName)
          return user
        }
      })
      .map(user => user.displayName)    
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
