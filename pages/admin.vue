<template>
  
    <div>
        <h1>This is the admin page that will make a game</h1>

        <p>Right now it's just simple</p>

        <button @click="generateGame">Generate game session</button>

        <hr>
        <p>Active games:</p>
        <ul>
            <li v-for="game in getActiveGames" :key="game.id">
                {{ game }}
            </li>
        </ul>
    </div>

</template>

<script>

import socket from '~/plugins/socket.io.js'
import {mapGetters, mapMutations} from "vuex";

function randomNumber() {
    return Math.floor(Math.random() * 100000000)
}

export default {

    computed: {
        ...mapGetters({
            getActiveGames: "getActiveGames"
        })
    },

    methods: {
        ...mapMutations({
            addActiveGame: "addActiveGame",
        }),
        generateGame() {
            const gameNumber = randomNumber()
            this.addActiveGame(gameNumber)
        }
    }
}
</script>

<style>

</style>