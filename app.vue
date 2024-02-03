<!-- import WalletConnector from '../components/wallet/polkadot-wallet.vue'; -->
<template>
  <div id="app">
    <!-- <NuxtLayout> -->
    <!-- <header> -->
      <!-- Header content goes here -->
      <!-- <h1>My Vue App</h1> -->
      <!-- Navigation Button -->
      <!-- <router-link to="/test" class="nav-button">Test</router-link> -->
      <!-- wallet connector -->
      <!-- <WalletConnector /> -->
    <!-- </header> -->

    <main>
      <!-- Main content will be loaded here -->
      <NuxtPage />
    </main>

    <!-- <footer> -->
      <!-- Footer content goes here -->
      <!-- <p>&copy; 2023 My Vue App</p> -->
    <!-- </footer> -->
  <!-- </NuxtLayout> -->
  </div>
  
</template>

<script>
export default {
  name: 'App',
  // Any global components you might want to include can be registered here
  components: {
    // componentName: Component
  }
}
</script>

<style>
/* Global styles for your app */
#app {
  text-align: center;
}
</style>
