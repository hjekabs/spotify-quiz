// export const state = () => ({
//     users: []
// })

// export const mutations = () => {
//     setUser (user) {
//         state.users.push(user)
//     }
// }


export const state = () => ({
    users: [],
    activeGames: []
})

export const getters = {
    getUsers(state) {
        return state.users
    },
    getActiveGames(state) {
        return state.activeGames
    }
}

export const mutations = {
    addUser(state, user) {
        state.users.push(user)
    },
    addActiveGame(state, nr) {
        state.activeGames.push(nr)
    }
}
