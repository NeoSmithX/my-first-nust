<template>
  <div>
    <select v-model="selectedWallet" @change="resetConnection">
      <option value="subwallet-js">SubWallet</option>
      <option value="polkadot-js">Polkadot{.js}</option>
      <option value="talisman">Talisman</option>
    </select>

    <button v-if="!isConnected && !accounts.length" @click="connectWallet">
      Connect to {{ selectedWalletName }}
    </button>

    <div v-if="isConnected && accounts.length">
      <select v-model="selectedAccountAddress" @change="handleFinalizeConnection">
        <option v-for="account in accounts" :key="account.address" :value="account.address">
          {{ account.name }} ({{ account.address }})
        </option>
      </select>
    </div>

    <div v-if="selectedAccount">
      <p>Wallet connected: {{ selectedAccount.name }} ({{ selectedAccount.address }})</p>
      <button @click="disconnectWallet">Disconnect</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWalletStore } from '@/stores/polkadot-wallet';
import { storeToRefs } from 'pinia';
import App from '~/app.vue'
import { createPinia } from 'pinia';
import { createApp } from 'vue'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const store = useWalletStore();


// const store = useWalletStore();

// Use storeToRefs for reactive state properties
const { isConnected, accounts, selectedAccount, selectedWallet, selectedAccountAddress, selectedWalletName } = storeToRefs(store);

// Access actions directly from the store
const { connectWallet, disconnectWallet, finalizeConnection, resetConnection } = store;

// Computed properties for v-model bindings or other reactive transformations
const selectedWalletModel = computed({
  get: () => selectedWallet.value,
  set: (value) => { store.selectedWallet = value; },
});

const selectedAccountAddressModel = computed({
  get: () => selectedAccountAddress.value,
  set: (value) => { store.finalizeConnection(value); },
});
function handleFinalizeConnection(event: Event) {
  // Extracting the value from the event target (which is the select element)
  const selectedValue = (event.target as HTMLSelectElement).value;
  finalizeConnection(selectedValue);
  console.log('connected account: ', selectedValue);
}
// Now, you can use connectWallet, disconnectWallet, and finalizeConnection directly in your template or script without errors.
</script>

