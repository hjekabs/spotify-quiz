// export const state = () => ({
//     users: []
// })

// export const mutations = () => {
//     setUser (user) {
//         state.users.push(user)
//     }
// }


export const state = () => ({
    user: {},
    activeGames: []
})

export const getters = {
    getUser(state) {
        return state.user
    },
    getActiveGames(state) {
        return state.activeGames
    }
}

export const mutations = {
    addUser(state, user) {
        state.user = user;
    },
    addActiveGame(state, nr) {
        state.activeGames.push(nr)
    }
}
