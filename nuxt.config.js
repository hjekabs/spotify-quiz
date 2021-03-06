import dotenv from 'dotenv'
dotenv.config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/theme/theme.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/updatestorage.client.js',
      mode: 'client'
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/dotenv'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '~/io'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    watch: ['api'],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
    // serverMiddleware: ['~/api']
  },
  serverMiddleware: ['~/api'],
  auth: {
    strategies: {
      social: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://accounts.spotify.com/authorize',
        scope: ['user-read-private', 'user-top-read'],
        access_type: 'offline',
        access_token_endpoint: undefined,
        response_type: 'token',
        token_type: 'Bearer',
        redirect_uri:
          `${process.env.BASE_URL}callback` || 'http://localhost:3000/callback',
        client_id: 'f79dd1f6402b41fe8828c55654cea80a',
        token_key: 'access_token'
      }
    }
  },

  router: {
    middleware: ['auth']
  }
}
