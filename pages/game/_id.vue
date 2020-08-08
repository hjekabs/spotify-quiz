<template>
  <div class="w-100 h-100">
    <div
      v-if="game.loadStatus === 'INITIAL'"
      class="h-100 d-flex flex-column justify-content-between"
    >
      <div class="row p-3">
        <div class="col-12 col-md-6 h1 py-4">
          Join with:
          <span class="start-text text-primary">
            {{ this.$route.query.id }}
          </span>
        </div>
        <div
          class="col-12 col-md-6 text-center text-md-right"
          v-if="isAdmin === true"
        >
          <button
            class="btn btn-outline-primary p-4 start-button"
            @click="emitReadyGame"
          >
            start game
          </button>
        </div>
      </div>

      <div class="users-container w-100 h-100 flex-1 p-5">
        <div class="row">
          <div
            v-for="user in users"
            :key="user.id"
            class="col-12 col-md-6 text-center"
          >
            <div>
              <p class="user-lobby-card animate__animated animate__flipInX h2">
                <img :src="user.imageUrl" alt class="user-avatar" />
                {{ user.displayName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-else-if="game.loadStatus === 'LOADING'">
      Setting up the game, please wait...
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>-->
    <div v-else-if="game.loadStatus === 'GETREADY'" class="text-center">
      <h1>Game starts in</h1>
      <div class="start-text text-primary">{{ game.startTimer }}</div>
    </div>
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
      <h2>Next question starts in: {{ game.breakTimer }}</h2>
    </div>
    <div v-else-if="game.loadStatus === 'GAME_OVER'">
      <h1>Game over!</h1>
      <p>{{ allAnswers }}</p>
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
        startTimer: 5,
        breakTimer: 10,
        breakTimerStarted: true
      },
      answers: [],
      allAnswers: [],
      questionNumber: 0,
      isAdmin: false
    }
  },

  computed: {
    ...mapGetters({
      getUser: 'getUser'
    }),
    progressWidth() {
      return 100 / this.startTimer
    }
  },

  methods: {
    ...mapMutations({
      addUser: 'addUser'
    }),
    readyGame() {
      this.game.loadStatus = 'GETREADY'
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
    },
    answerBreak(socketId) {
      const self = this
      this.breakTimerStarted = true
      const decrementTimer = setInterval(() => {
        if (self.game.breakTimer === 1) {
          clearInterval(decrementTimer)
          self.questionNumber++
          self.game.breakTimer = 10
          self.game.loadStatus = 'START'
          self.answers = []
          self.game.breakTimerStarted = true
        }
        self.game.breakTimer--
      }, 1000)
    },
    assignTimer(prop, val) {
      this.game[prop] = val
    }
  },
  watch: {
    questionNumber() {
      if (this.questionNumber >= this.tracks.length) {
        this.game.loadStatus = 'GAME_OVER'
      }
    }
  },

  mounted() {
    const gamePin = this.$route.query.id
    const isAdmin = this.$route.query.admin

    // set the user from localstorage
    this.user = JSON.parse(sessionStorage.getItem('user'))

    if (isAdmin === 'true') {
      this.isAdmin = true
    }
    const self = this
    socket.emit('user-joined-game', {
      pin: gamePin,
      user: self.user
    })

    socket.on('game-ready-users', function(msg) {
      const { user, allUsers, socketId, pin } = msg
      self.users = allUsers
      // self.user = user
      self.pin = pin
      self.socketId = socketId
      self.addUser({ ...user, socketId: socketId })
    })

    // start the game for all users
    socket.on('start-game', function(msg) {
      self.readyGame()
    })

    socket.on('all-answered', function(msg) {
      // we can create dynamic timer variables for each socket id
      const { allAnswers, answers, socketId } = msg
      self.answers = answers
      self.allAnswers = allAnswers

      if (self.game.breakTimerStarted) {
        self.answerBreak(socketId)
      }
      self.game.breakTimerStarted = false
    })

    socket.on('user-left-the-game', function(msg) {
      self.$router.push('/lobby')
    })
  }
}
</script>

<style lang="scss">
.start-button,
.start-text {
  font-size: 3rem;
}

.start-button:hover {
  -webkit-box-shadow: 10px 10px 99px 6px rgba(29, 185, 84, 1);
  -moz-box-shadow: 10px 10px 99px 6px rgba(29, 185, 84, 1);
  box-shadow: 10px 10px 99px 6px rgba(29, 185, 84, 1);
  cursor: pointer;
  color: white;
}

.users-container {
  background-color: #121212;
}
</style>
