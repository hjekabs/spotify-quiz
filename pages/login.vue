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
    mounted() {

        const {code} = this.$route.query

        console.log(this.$auth.loggedIn)

        if(code) {
            console.log("we should request the access token here")
            this.$axios.$post("https://accounts.spotify.com/api/token")
        }
    }
}
</script>

<style>

</style>