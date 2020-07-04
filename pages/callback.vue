<template>
  <div>
      <h1>This is the callback page</h1>
  </div>
</template>

<script>

import { mapMutations } from "vuex";
import socket from '~/plugins/socket.io.js'

export default {
    async mounted() {
        
        const accessToken = this.$auth.getToken("social")

        const userInfo = await this.$axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: accessToken
            }
        })

        console.log(userInfo)

        const { display_name, email, id} = userInfo.data

        const user = {
            display_name,
            email,
            id
        }

        console.log("should emit")
        socket.emit("user-logged_in", user)

    }
}
</script>

<style>

</style>