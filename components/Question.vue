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
          @click="onClickAnswer(user.socketId)"
        >
          <img :src="user.imageUrl" class="img-thumbnail" />
          {{ user.displayName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['tracks', 'user', 'allUsers', 'questionNumber', 'socketId'],
  computed: {
    ...mapGetters({
      getUser: 'getUser'
    })
  },
  methods: {
    onClickAnswer(socketId) {
      // TODO: add a time limit for question

      if (socketId === this.tracks[this.questionNumber].socketId) {
        // user has answered correct
        this.$emit('answerClick', true)
      } else {
        this.$emit('answerClick', false)
      }
      // this.$emit('answerClick', socketId)
    }
  },
  mounted() {
    console.log(this.tracks)
    console.log(this.allUsers)
  }
}
</script>

<style>
.img-thumbnail {
  width: 50px;
  height: 50px;
}

.user-col {
  border: 2px solid rgb(109, 86, 86);
}

.user-col:hover {
  background-color: rgb(236, 235, 235);
  cursor: pointer;
}
</style>
