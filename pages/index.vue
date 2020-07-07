<template>
  <div class="container">
    <h1>Index page</h1>
  </div>
</template>

<script>

import socket from '~/plugins/socket.io.js'

export default {
  async mounted() {
    const accessToken = this.$auth.getToken("social")

    console.log(accessToken)

    const userInfo = await this.$axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: accessToken
        }
    })

    const { display_name, email, id} = userInfo.data

        const user = {
            display_name,
            email,
            id
        }

        socket.emit("user-logged_in", userInfo.data)

        this.$router.push("/lobby")
  }
}
</script>

<style>

</style>
