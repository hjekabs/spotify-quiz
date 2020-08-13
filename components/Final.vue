<template>
  <div class="h-100 w-100">{{ answers }}</div>
</template>

<script>
export default {
  props: ['answers'],
  computed: {
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
    }
  },
  mounted() {
    console.log(this.answers)
  }
}
</script>

<style>
</style>