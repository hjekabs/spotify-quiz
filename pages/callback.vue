<template>
  <div>
      <h1>This is the callback page</h1>
  </div>
</template>

<script>

import { mapMutations } from "vuex";

export default {
    async mounted() {
        
        const accessToken = this.$auth.getToken("social")

        const userInfo = await this.$axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: accessToken
            }
        })

        console.log(userInfo)

        // this.socket = this.$nuxtSocket({
        //     channel: "/index"
        // })

        // this.socket.$emit("userLoggedIn", {

        // })
    }
}
</script>

<style>

</style>