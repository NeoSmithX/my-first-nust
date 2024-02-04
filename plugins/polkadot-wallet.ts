

import { defineNuxtPlugin } from '#app';
import polkadotWallet from '~/components/wallet/polkadot-wallet.vue';

export default defineNuxtPlugin((nuxtApp) => {

    const stateGlobal = {
        selectedWallet: 'subwallet-js',
        isConnected: false,
        accounts: [],
        selectedAccountAddress: '',
        selectedAccount: null,
    }

    // Use `nuxtApp.provide` to make it globally available
    nuxtApp.provide('polkadotWalletState', stateGlobal)

    nuxtApp.vueApp.component('polkadotWallet', polkadotWallet);
});
