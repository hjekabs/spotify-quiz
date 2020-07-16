<template>
  <div>
    <h1>This is the callback page</h1>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import socket from '~/plugins/socket.io.js'

export default {
  methods: {
    ...mapMutations({
      addUser: 'addUser'
    })
  },

  async mounted() {
    const accessToken = this.$auth.getToken('social')

    const userInfo = await this.$axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: accessToken
      }
    })

    let topUserTracks = undefined

    try {
      const userTracks = await this.$axios.get(
        'https://api.spotify.com/v1/me/top/tracks',
        {
          headers: {
            Authorization: accessToken
          }
        }
      )
      topUserTracks = userTracks.data
    } catch (e) {
      console.log(e)
    }

    const { display_name, email, id } = userInfo.data

    const user = {
      userInfo: userInfo.data,
      topUserTracks
    }

    // socket.emit('user-logged_in', user)
    this.addUser(user)
    this.$router.push('/lobby')
  }
}
</script>

<style>
</style>