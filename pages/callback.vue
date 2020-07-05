<template>
  <div>
      <h1>This is the callback page</h1>
  </div>
</template>

<script>

import { mapMutations } from "vuex";
import socket from '~/plugins/socket.io.js'

export default {

    methods: {
        ...mapMutations({
            addUser: "addUser"
        })
    },

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

        this.addUser(userInfo.data)
        
        // add to logged in users
        console.log("should emit")
        socket.emit("user-logged_in", userInfo.data)

        this.$router.push({path: "lobby"})

    }
}
</script>

<style>

</style>