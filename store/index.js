// export const state = () => ({
//     users: []
// })

// export const mutations = () => {
//     setUser (user) {
//         state.users.push(user)
//     }
// }


export const state = () => ({
    users: []
})

export const getters = {
    getUsers(state) {
        return state.users
    }
}

export const mutations = {
    addUser(state, user) {
        state.users.push(user)
    },
}
