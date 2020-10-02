<template>
  <div class="h-100 w-100">{{ allScores }}</div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
export default {
  props: ['answers'],
  data() {
    return {
      userScore: {
        socketId: undefined,
        totalScore: 0
      },
      allScores: []
    }
  },
  computed: {
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
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
      const { scores } = msg
      self.allScores = scores
    })
  }
}
</script>
