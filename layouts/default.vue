<template>
    <div>
        <header>
            <p top-bar-content>Step to Real Scenario with Inscription</p>
            <nav>
                <NuxtLink to="/" class="nav-button">Home</NuxtLink> &nbsp;
                <NuxtLink to="/deploy-question" class="nav-button">Deploy</NuxtLink> &nbsp;
                <NuxtLink to="/mint-answer" class="nav-button">Mint</NuxtLink> &nbsp;
            </nav>

            <div class="wallet-connector">
                <WalletConnector />
            </div>
        </header>
        <slot />
        <!-- <main> -->
            <!-- word -->
            <!-- <NuxtPage /> -->
        <!-- </main> -->
        <footer>

            <p>&copy; 2024 Simple Inscritpion by Neo</p>
        </footer>
    </div>
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
}
</style>