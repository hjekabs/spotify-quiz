<template>
  <div>
      <h1>First we need to log in</h1>
      <button @click="login">Log in</button>
  </div>
</template>

<script>
export default {
    methods: {
        login() {
            this.$auth.loginWith("social")
        }
    },
}
</script>

<style>

</style>