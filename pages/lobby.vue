<template>
  <div>
      <h1>This is the lobby and should show logged in users:</h1>
  </div>
</template>

<script>

import socket from '~/plugins/socket.io.js'

export default {

    // auth: false,

    data() {
        return {
            users: [],
        }
    },

    beforeMount () {
        socket.on('logged-in-users', (message) => {
            console.log(message)
        })
    },
}
</script>

<style>

</style>