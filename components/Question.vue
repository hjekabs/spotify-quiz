<template>
  <div>
    <div class="card">
      <div class="card-body">
        {{ tracks[questionNumber].trackName }}
        {{ tracks[questionNumber].socketId }}
      </div>
    </div>

    <hr />

    <div class="container">
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
      timer: 15
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
      if (socketId === this.tracks[this.questionNumber].socketId) {
        // user has answered correct
        this.$emit('answerClick', {
          displayName,
          score: 1
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
    }
  },
  mounted() {
    console.log('mounted')
    const self = this
    socket.on('add-answered', function(msg) {
      const answer = msg
      self.answers.push(answer)
    })
    if (this.tracks[this.questionNumber].trackPreviewUrl) {
      const audio = new Audio(this.tracks[this.questionNumber].trackPreviewUrl)
      console.log(audio)
      audio.play()
    }
  },
  beforeDestroy() {
    console.log('about to destroy')
    console.log(this.tracks.trackPreviewUrl)
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
