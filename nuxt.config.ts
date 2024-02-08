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
      PUBLIC_adminList: process.env.PUBLIC_adminList,
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
