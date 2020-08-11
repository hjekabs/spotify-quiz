import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations({
      addUser: 'addUser'
    })
  },
  async mounted() {
    const accessToken = this.$auth.getToken('social')

    console.log(accessToken)

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
      //   top user tracks from spotify
      topUserTracks = userTracks.data
    } catch (e) {
      console.log(e)
    }

    // full user object from spotifh
    const userData = userInfo.data

    // prepare the user object

    const user = {
      displayName: userData.display_name,
      trackInfo: []
    }

    // check if image and add if exists
    if (userData.images[0]) user.imageUrl = userData.images[0].url

    if (topUserTracks.items.length) {
      topUserTracks.items.map(item => {
        user.trackInfo.push({
          trackHref: item.href,
          trackName: item.name,
          trackPopularity: item.popularity,
          trackPreviewUrl: item.preview_url,
          trackArtists: item.artists,
          trackPopularity: item.popularity,
          trackAlbumImage: item.album.images[0].url
        })
      })
    }

    // socket.emit('user-logged_in', user)
    this.addUser(user)
    // we can now save this user in local storage
    sessionStorage.setItem('user', JSON.stringify(user))

    this.$router.push('/lobby')
  }
}
