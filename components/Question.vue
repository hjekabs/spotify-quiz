<template>
  <div class="w-100 h-100">
    <div v-if="showAnswerSong">
      {{ tracks[questionNumber].trackName }}
      {{ tracks[questionNumber].socketId }}
      Preview ends in: {{ songTimer }}
    </div>

    <hr />

    <div class="container" v-if="showAnswerOptions">
      Answer in: {{ optionsTimer }}
      <div class="row">
        <div
          v-for="user in allUsers"
          :key="user.id"
          class="col user-col"
          @click="onClickAnswer(user)"
        >
          <img :src="user.imageUrl" class="img-thumbnail" />
          {{ user.displayName }}
        </div>
      </div>
    </div>

    <hr />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import socket from '~/plugins/socket.io.js'

export default {
  props: ['tracks', 'user', 'allUsers', 'questionNumber', 'socketId'],
  data() {
    return {
      answers: [],
      songTimer: 10,
      optionsTimer: 10,
      showAnswerSong: true,
      showAnswerOptions: false,
      maxScore: 1000
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'getUser'
    })
  },
  methods: {
    onClickAnswer(user) {
      // TODO: add a time limit for question
      const { socketId, displayName } = user
      const score = this.maxScore
      if (socketId === this.tracks[this.questionNumber].socketId) {
        // user has answered correct
        this.$emit('answerClick', {
          displayName,
          score
        })
      } else {
        this.$emit('answerClick', {
          displayName,
          score: 0
        })
      }
    }
  },
  watch: {
    answers() {
      if (this.answers.length === this.allUsers.length) {
        console.log('emiting all user answered')
        this.$emit('allUsersAnswered', this.answers)
        this.answers = []
      }
    },
    showAnswerOptions() {
      const self = this
      const { displayName } = this.user
      const score = this.maxScore
      // if user fails to answer in 10 seconds his score is 0
      const startOptionsTimer = setInterval(() => {
        if (self.optionsTimer === 1) {
          clearInterval(startOptionsTimer)
          this.$emit('answerClick', {
            displayName,
            score: 0
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
    const self = this
    if (this.tracks[this.questionNumber].trackPreviewUrl) {
      this.audio = new Audio(this.tracks[this.questionNumber].trackPreviewUrl)
      this.audio.play()
    }

    const startSongTimer = setInterval(() => {
      if (self.songTimer === 1) {
        clearInterval(startSongTimer)
        self.showAnswerSong = false
        self.showAnswerOptions = true
      }
      self.songTimer--
    }, 1000)

    socket.on('add-answered', function(msg) {
      const answer = msg
      self.answers.push(answer)
    })
  },
  beforeDestroy() {
    this.audio.pause()
  }
}
</script>

<style>
.img-thumbnail {
  width: 50px;
  height: 50px;
}

.user-col {
  border: 1px solid;
  background-color: transparent;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 20px;
  font-weight: light;
  color: #4cc9f0;
}

.user-col:hover {
  background-color: #4cc9f0;
  -webkit-box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
  -moz-box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
  box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
  cursor: pointer;
  color: white;
}
</style>
