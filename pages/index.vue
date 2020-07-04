<template>
  <div class="container">
    <h1>Index page</h1>
  </div>
</template>

<script>

export default {
  async mounted() {
    const accessToken = this.$auth.getToken("social")

    console.log(accessToken)

    const userInfo = await this.$axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: accessToken
        }
    })

    console.log(userInfo)
  }
}
</script>

<style>

</style>
