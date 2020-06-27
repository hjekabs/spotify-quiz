<template>
  <div>
      <h1>This is the lobby and should show logged in users:</h1>
  </div>
</template>

<script>
export default {

    auth: false,

    data() {
        return {
            users: [],
        }
    },

    mounted() {
        this.socket = this.$nuxtSocket({
            channel: "/index"
        })

        this.socket
        .on("userLoggedIn", (msg, cb) => {
            console.log(msg)
        })
    }
}
</script>

<style>

</style>