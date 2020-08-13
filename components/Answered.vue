<template>
  <div class="h-100 w-100 container-fluid d-flex flex-column justify-content-between px-3 px-md-5">
    <div class="row">
      <div class="col-12 col-md-6 text-center text-md-left">
        <img :src="track.trackAlbumImage" alt="..." width="200" height="200" />
        <p class="mb-0">{{ track.trackName }}</p>
        <small class="mb-0">
          <span v-for="artist in track.trackArtists" :key="artist.id">{{ artist.name }},</span>
        </small>
      </div>
      <div class="col-12 col-md-6 text-center">
        <p>
          Is a top song for:
          <span
            v-if="isCurrentUserSong"
            class="text-primary start-text d-block"
          >You</span>

          <span class="text-primary start-text d-block" v-else>
            <img :src="track.userImageUrl" class="user-avatar" />
            {{ track.userDisplayName }}
          </span>
        </p>
      </div>
    </div>
    <div class="row flex-grow-1 align-items-center justify-content-center">
      You scored:
      <span class="text-primary start-text d-block">{{ userScore }}</span>
    </div>
    <div class="row dark-background align-items-center justify-content-end">
      Next question in:
      <span class="text-primary start-text">{{ timer }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['timer', 'answers', 'track'],
  data() {
    return {
      userScore: 0
    }
  },
  computed: {
    isCurrentUserSong() {
      return this.socketId === this.track.socketId
    },
    getUserSocket() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user.socketId
    }
  },
  watch: {
    answers() {
      const id = this.getUserSocket
      console.log(id)
      if (this.answers) {
        const userAnswer = this.answers.filter(
          answer => answer.socketId === id
        )[0]
        console.log(userAnswer)
        this.userScore = userAnswer.score
      }
    }
  }
}
</script>

<style>
</style>