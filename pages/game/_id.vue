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

      <button @click="emitReadyGame">start game</button>
    </div>
    <div v-else-if="game.loadStatus === 'LOADING'">
      Setting up the game, please wait...
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="game.loadStatus === 'GETREADY'">{{ game.startTimer }}</div>
    <div v-else-if="game.loadStatus === 'START'">
      <!-- Question component -->
      <Question
        :tracks="tracks"
        :user="user"
        :allUsers="users"
        :questionNumber="questionNumber"
        :socketId="socketId"
        @answerClick="questionAnswered"
        @allUsersAnswered="allUsersAnswered"
      />
    </div>
    <div v-else-if="game.loadStatus === 'ANSWER_BREAK'">
      <h1>All users have answered now</h1>
      <p>{{ answers }}</p>
      <p>
        All answers:
        {{ allAnswers }}
      </p>
      <h2>Next question starts in: {{ game.breakTimer }}</h2>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import { mapGetters, mapMutations } from 'vuex'
import { gameData } from '~/utils/game.js'
import Question from '~/components/Question.vue'

export default {
  components: {
    Question
  },
  data() {
    return {
      users: [],
      tracks: [],
      game: {
        loadStatus: 'INITIAL',
        startTimer: 3,
        breakTimer: 10
      },
      answers: [],
      allAnswers: [],
      questionNumber: 0
    }
  },

  computed: {
    ...mapGetters({
      getUser: 'getUser'
    })
  },

  methods: {
    ...mapMutations({
      addUser: 'addUser'
    }),
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
    },
    emitReadyGame() {
      socket.emit('clicked-start-game', this.pin)
    },
    questionAnswered(answer) {
      const pin = this.pin
      socket.emit('user-answered-question', {
        pin,
        answer
      })
    },
    allUsersAnswered(answers) {
      this.game.loadStatus = 'ANSWER_BREAK'
      const pin = this.pin
      socket.emit('all-users-answered-question', {
        pin,
        answers
      })
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
      const { user, allUsers, socketId, pin } = msg
      self.users = allUsers
      self.user = user
      self.pin = pin
      self.socketId = socketId
      self.addUser({ ...user, socketId: socketId })
    })

    // start the game for all users
    socket.on('start-game', function(msg) {
      self.readyGame()
    })

    socket.on('all-answered', function(msg) {
      const { allAnswers, answers } = msg
      self.answers = answers
      self.allAnswers = allAnswers
      const decrementTimer = setInterval(() => {
        if (self.game.breakTimer === 1) {
          clearInterval(decrementTimer)
          self.questionNumber++
          self.game.breakTimer = 10
          self.game.loadStatus = 'START'
          self.answers = []
        }
        self.game.breakTimer--
      }, 1000)
    })
  }
}
</script>

<style></style>
