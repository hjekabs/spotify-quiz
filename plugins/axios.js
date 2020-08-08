export default function({ $axios, redirect }) {
  $axios.onError(error => {
    console.log(error)
    console.log(error.response)
    if (error.response.status === 401) {
      redirect('/logout')
    }
  })
}
