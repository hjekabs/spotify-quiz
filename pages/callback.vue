<template>
  <div>
    <h1>This is the callback page</h1>
  </div>
</template>

<script>
import setup from '~/mixins.js/setup.js'
import socket from '~/plugins/socket.io.js'

export default {
  mixins: [setup]
}
</script>

<style>
</style>