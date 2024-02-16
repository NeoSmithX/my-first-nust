// https://nuxt.com/docs/api/configuration/nuxt-config
// require('dotenv').config()
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    { src: '~/plugins/polkadot-api.ts', mode: 'client' }, // Ensures the plugin is ony exelcuted client-side
    { src: '~/plugins/polkadot-wallet.ts', mode: 'client' }, 
    { src: '~/plugins/firebase-init.ts', mode: 'client' },
  ],
  runtimeConfig: {
    public:{
      //
      PUBLIC_adminList: process.env.PUBLIC_adminList,
      // firebaseConfig
      PUBLIC_apiKey: process.env.PUBLIC_apiKey,
      PUBLIC_authDomain: process.env.PUBLIC_authDomain,
      PUBLIC_projectId: process.env.PUBLIC_projectId,
      PUBLIC_storageBucket: process.env.PUBLIC_storageBucket,
      PUBLIC_messagingSenderId: process.env.PUBLIC_messagingSenderId,
      PUBLIC_appId: process.env.PUBLIC_appId,
      PUBLIC_measurementId: process.env.PUBLIC_measurementId,
    }
  },
  // css: ['~/assets/css/tailwind.css'],
  // build: {
  //   postcss: {
  //     postcssOptions: require('./postcss.config.js'), // Optional: only if you have other PostCSS config
  //   },
  // },
  modules: [
    '@pinia/nuxt',
    // '@nuxtjs/dotenv',
  ],
})
