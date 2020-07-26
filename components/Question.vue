<template>
  <div>
    <button @click="onClickAnswer">Click me</button>
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
    onClickAnswer(event) {
      this.$emit('answerClick', 'some value')
    }
  },
  mounted() {
    console.log('mounted')
    console.log(this.allUsers)
    console.log(this.questionNumber)
  }
}
</script>

<style></style>
