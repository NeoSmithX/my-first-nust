

<template>
  <div id="app">
    <!-- <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout> -->
    <NuxtPage />
    <!-- <NuxtLayout>
    <NuxtPage />
  </NuxtLayout> -->
    <!-- Global components like headers, footers, or layouts are not typically placed here -->
    <!-- Your application's structure is mainly handled by pages and layouts -->
  </div>
</template>

<script>
// import { useUserStore } from '@/stores/user'
// import { createPinia } from 'pinia';
// import { createApp } from 'vue'
// import App from './App.vue'
// const pinia = createPinia()
// const app = createApp(App)
// app.use(pinia)

export default {
  name: 'App',
  // Global component registration can be handled here if needed, but plugins are preferred
}
</script>

<style>
/* Global styles for your app */
#app {
  text-align: center;
}
</style>
