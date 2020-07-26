export const gameData = allUsers => {
  // later dynamically define users
  const questions = 10
  const userCount = allUsers.length
  let initialSongsPerUser = Math.floor(questions / userCount)
  const gameData = []

  // add socketIds to songs
  prepareData(allUsers)

  const userTracks = allUsers.map(user => user.trackInfo)
  // // sort the data
  sortData(userTracks, gameData, 0, initialSongsPerUser)

  while (gameData.length < questions) {
    let increment = Math.floor(questions / gameData.length)
    let nextSongsPerUser = initialSongsPerUser + increment

    sortData(userTracks, gameData, initialSongsPerUser, nextSongsPerUser)

    initialSongsPerUser = nextSongsPerUser
  }

  const shuffledGameData = shuffle(gameData)

  return shuffledGameData
}

// add socketId to track object
function prepareData(users) {
  return users.map(user => {
    user.trackInfo.map(track => {
      track.socketId = user.socketId
      track.userDisplayName = user.displayName
    })
  })
}

function sortData(tracks, pushTo, start, end) {
  tracks.forEach(track => {
    if (track.length) {
      track.slice(start, end).forEach(t => {
        pushTo.push(t)
      })
    }
  })
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
