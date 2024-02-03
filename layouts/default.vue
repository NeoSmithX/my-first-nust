<template>
    <div>
        <header>
            <!-- Top Bar Content -->
            <p top-bar-content>My Top Bar</p>
            <nav>
                <!-- NuxtLink for navigation -->
                <!-- <NuxtLink to="/">Home</NuxtLink> -->
                <NuxtLink to="/test" class="nav-button">Test</NuxtLink> &nbsp;
                <NuxtLink to="/" class="nav-button">Home</NuxtLink> &nbsp;
               


            </nav>
            <!-- <WalletConnector  /> -->
            <div class="wallet-connector">
                <WalletConnector />
            </div>
        </header>

        <!-- Main content where Nuxt.js will inject page content -->
        <Nuxt />
    </div>
    <footer>
        <!-- Footer content goes here -->
        <p>&copy; 2024 Simple Inscritpion by Neo</p>
    </footer>
</template>
  
<script>
//   // Import the WalletConnector component
import WalletConnector from '~/components/wallet/polkadot-wallet.vue';

export default {
    components: {
        WalletConnector,
    },
};

</script>

<style>
.header {
    display: flex;
    justify-content: space-between;
    /* Align items to the start and end of the container */
    align-items: center;
    /* Center items vertically */
    padding: 0 20px;
    /* Add some padding */
}

/* .header-content { */
    /* Styles for your header content */
/* } */

.wallet-connector {
    margin-left: auto;
    /* Additional styles for your wallet connector button, if needed */
}</style>