// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    { src: '~/plugins/polkadot-api.ts', mode: 'client' } // Ensures the plugin is only executed client-side
  ],
})
