<template>
  <div class="w-100 h-100">
    <div
      v-if="game.loadStatus === 'INITIAL'"
      class="h-100 d-flex flex-column justify-content-between"
    >
      <div class="row p-3">
        <div class="col-12 col-md-6 py-4 text-center text-md-left">
          Join with:
          <span class="start-text text-primary">{{ this.$route.query.id }}</span>
        </div>
        <div class="col-12 col-md-6 text-center text-md-right" v-if="isAdmin === true">
          <button
            class="btn btn-outline-primary p-md-4 start-button"
            @click="emitReadyGame"
          >start game</button>
        </div>
      </div>

      <div class="dark-background w-100 h-100 flex-1 p-5">
        <div class="row">
          <div v-for="user in users" :key="user.id" class="col-12 col-md-6 text-center">
            <div>
              <p class="user-lobby-card animate__animated animate__flipInX">
                <img :src="user.imageUrl" alt class="user-avatar" />
                {{ user.displayName }}
                <span
                  v-if="user.socketId === getUserSocket"
                >(you)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="game.loadStatus === 'GETREADY'"
      class="h-100 d-flex flex-column align-items-center justify-content-center"
    >
      <div class="text-center">
        <h1>Game starts in</h1>
        <div class="start-text text-primary">{{ game.startTimer }}</div>
      </div>
    </div>
    <div v-else-if="game.loadStatus === 'START'" class="w-100 h-100">
      <!-- Question component -->
      <Question
        :tracks="tracks"
        :user="user"
        :allUsers="users"
        :questionNumber="questionNumber"
        @answerClick="questionAnswered"
        @allUsersAnswered="allUsersAnswered"
      />
    </div>
    <div v-else-if="game.loadStatus === 'ANSWER_BREAK'" class="w-100 h-100">
      <Answered :timer="game.breakTimer" :answers="answers" :track="tracks[questionNumber]" />
    </div>
    <div v-else-if="game.loadStatus === 'GAME_OVER'" class="w-100 h-100">
      <GameFinal :answers="allAnswers" />
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import updateStorage from '~/plugins/updatestorage.client.js'
import { mapGetters, mapMutations } from 'vuex'
import { gameData } from '~/utils/game.js'
import Question from '~/components/Question.vue'
import Answered from '~/components/Answered.vue'
import GameFinal from '~/components/GameFinal.vue'

export default {
  components: {
    Question,
    Answered,
    GameFinal
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
    },
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
    }
  },

  methods: {
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
      const { allUsers, socketId, pin } = msg

      // add the socketId for the session storage user
      let sessionUser = JSON.parse(sessionStorage.getItem('user'))

      if (!sessionUser.socketId) {
        sessionUser = { ...sessionUser, socketId }
        sessionStorage.setItem('user', JSON.stringify(sessionUser))
      }

      self.users = allUsers
      self.pin = pin
      self.socketId = socketId
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
      self.game.loadStatus = 'ANSWER_BREAK'

      if (self.game.breakTimerStarted) {
        self.answerBreak(socketId)
      }
      self.game.breakTimerStarted = false
    })
  }
}
</script>

<style lang="scss">
.start-button:hover {
  -webkit-box-shadow: 10px 10px 99px 6px rgba(29, 185, 84, 1);
  -moz-box-shadow: 10px 10px 99px 6px rgba(29, 185, 84, 1);
  box-shadow: 10px 10px 99px 6px rgba(29, 185, 84, 1);
  cursor: pointer;
  color: white;
}
</style>
