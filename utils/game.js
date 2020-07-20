export const gameData = allUsers => {
  // later dynamically define users
  const questions = 10
  const userCount = allUsers.length
  let divideBy = Math.floor(questions / userCount)
  const gameData = []
  sortData(allUsers, gameData, divideBy)
  //   if gamedata is still not filled
  //   if (gameData.length < questions) {
  //   }

  //   run while we get full set of questions
  while (gameData.length < questions) {
    divideBy = Math.floor(questions / gameData.length)
    sortData(allUsers, gameData, divideBy)
  }

  return gameData
}

function sortData(users, pushTo, divideBy) {
  users.map(user => {
    // user object
    const obj = {
      user: user.socketId,
      tracks: user.trackInfo.slice(0, divideBy)
    }

    pushTo.push(obj)
  })
}
