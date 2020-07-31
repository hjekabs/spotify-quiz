<template>
  <div class="row justify-content-center">
    <div class="col col-md-6 d-flex justify-content-center align-items-center">
      <img src="~assets/img/login-game-friends.svg" alt />
    </div>
    <div class="col col-md-6 d-flex flex-column justify-content-center align-items-center">
      <h1>Spotify quiz</h1>
      <button class="btn btn-primary mt-3" @click="login">Sign in with spotify</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.loginWith('social')
    }
  }
}
</script>

<style>
img {
  width: 100%;
  height: 100%;
}
</style>