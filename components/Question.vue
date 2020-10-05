<template>
  <div class="w-100 h-100">
    <div
      v-if="showAnswerSong"
      class="h-100 w-100 d-flex align-items-center justify-content-center px-3"
    >
      <div class="text-center">
        <div class="animate__animated animate__pulse">
          <img
            :src="tracks[questionNumber].trackAlbumImage"
            width="200"
            height="200"
            alt
            class="rounded"
          />
          <span class="d-block">
            {{
            tracks[questionNumber].trackName
            }}
          </span>
          <small class="d-block">
            <span
              v-for="artist in tracks[questionNumber].trackArtists"
              :key="artist.id"
            >{{ artist.name }},</span>
          </small>
        </div>
        <div>
          <ProgressRing
            class="animate__animated animate__heartBeat mt-5"
            :progress="songProgress"
            :radius="100"
            :stroke="8"
            :timer="songTimer"
          />
        </div>
      </div>
    </div>
    <div class="container-fluid mx-0 h-100 w-100" v-if="showAnswerOptions">
      <div class="row">
        <div class="col-12 col-md-6 text-center text-md-left">
          {{
          tracks[questionNumber].trackName
          }}
        </div>
        <div class="col-12 col-md-6 text-center text-md-right">
          Time left:
          <span class="text-primary">{{ optionsTimer }}</span>
        </div>
      </div>
      <div
        class="row align-items-center justify-content-center h-100 dark-background px-3"
        v-if="!userAnswered"
      >
        <div
          v-for="user in allUsers"
          :key="user.id"
          class="col-12 col-md-6 text-center user-card p-2 dark-background mb-2 btn btn-outline-primary"
          @click="onClickAnswer(user)"
        >
          <img :src="user.imageUrl" class="user-avatar" />
          {{ user.displayName }}
          <span v-if="user.socketId === getUserSocket">(me)</span>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-center h-100 w-100" v-else>
        <div class="text-center">
          Waiting for all to answer
          <span class="d-block">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import ProgressRing from '~/components/ProgressRing.vue'

export default {
  components: {
    ProgressRing
  },
  props: ['tracks', 'user', 'allUsers', 'questionNumber'],
  data() {
    return {
      answers: [],
      songTimer: 10,
      songProgress: 0,
      optionsTimer: 10,
      showAnswerSong: true,
      showAnswerOptions: false,
      maxScore: 1000,
      userAnswered: false
    }
  },
  computed: {
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
    }
  },
  methods: {
    onClickAnswer(user) {
      this.userAnswered = true
      const { socketId, displayName } = user
      const answeredBySocket = this.getUserSocket
      const score = this.maxScore
      if (socketId === this.tracks[this.questionNumber].socketId) {
        // user has answered correct
        this.$emit('answerClick', {
          displayName,
          score,
          answeredBySocket
        })
      } else {
        this.$emit('answerClick', {
          displayName,
          score: 0,
          answeredBySocket
        })
      }
      clearInterval(this.startOptionsTimer)
    }
  },
  watch: {
    answers() {
      if (this.answers.length === this.allUsers.length) {
        this.$emit('allUsersAnswered', this.answers)
        this.answers = []
      }
    },
    showAnswerOptions() {
      const self = this
      const { displayName } = this.user
      const score = this.maxScore
      const answeredBySocket = this.getUserSocket
      // if user fails to answer in 10 seconds his score is 0
      this.startOptionsTimer = setInterval(() => {
        if (self.optionsTimer === 1) {
          clearInterval(self.startOptionsTimer)
          this.$emit('answerClick', {
            displayName,
            score: 0,
            answeredBySocket
          })
        }
        self.optionsTimer--
      }, 1000)

      // decrease the max score
      const decreaseMaxScore = setInterval(() => {
        if (self.optionsTimer === 1) {
          clearInterval(decreaseMaxScore)
        }
        self.maxScore--
      }, 10)
    }
  },
  mounted() {
    if (!this.mainAudio) {
      this.mainAudio = document.getElementById('main-audio')
    }

    const self = this
    if (this.tracks[this.questionNumber].trackPreviewUrl) {
      this.mainAudio.src = this.tracks[this.questionNumber].trackPreviewUrl
      this.mainAudio.play()
    }

    const startSongTimer = setInterval(() => {
      if (self.songTimer === 1) {
        clearInterval(startSongTimer)
        self.showAnswerSong = false
        self.showAnswerOptions = true
      }
      self.songTimer--
    }, 1000)

    const startSongProgressTimer = setInterval(() => {
      self.songProgress += 1
      if (self.songProgress === 100) {
        clearInterval(startSongProgressTimer)
      }
    }, 100)

    socket.on('add-answered', function(msg) {
      const answer = msg
      self.answers.push(answer)
    })
  },
  beforeDestroy() {
    this.mainAudio.pause()
  }
}
</script>

<style>
</style>
