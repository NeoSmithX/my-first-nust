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
      <select v-model="selectedAccountAddress" @change="finalizeConnection">
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
  
<script>
import { defineComponent, reactive, provide } from 'vue';

export default {
  data() {
    // init the global stateGlobal
    const stateGlobal = reactive({
      selectedWallet: 'subwallet-js',
      isConnected: false,
      accounts: [],
      selectedAccountAddress: '',
      selectedAccount: null,
    });
    provide('polkadotWalletState', stateGlobal);
    this.stateGlobal = stateGlobal;
    return {
      selectedWallet: 'subwallet-js',
      isConnected: false,
      accounts: [],
      selectedAccountAddress: '',
      selectedAccount: null,
    };

    //
  },
  computed: {
    selectedWalletName() {
      const walletNames = {
        'subwallet-js': 'SubWallet',
        'polkadot-js': 'Polkadot{.js}',
        'talisman': 'Talisman',
      };
      return walletNames[this.selectedWallet];
    },
  },
  methods: {
    async connectWallet() {
      if (typeof window !== 'undefined' && window.injectedWeb3 && window.injectedWeb3[this.selectedWallet]) {
        try {
          const walletExtension = window.injectedWeb3[this.selectedWallet];
          const extension = await walletExtension.enable();
          const accounts = await extension.accounts.get();
          if (accounts.length > 0) {
            this.accounts = accounts;
            this.isConnected = true;
          } else {
            alert('No accounts found.');
          }
        } catch (error) {
          console.error(`Failed to connect to ${this.selectedWalletName}:`, error);
        }
      } else {
        alert(`${this.selectedWalletName} extension not found.`);
      }
    },
    finalizeConnection() {
      this.selectedAccount = this.accounts.find(account => account.address === this.selectedAccountAddress);
      console.log('Account finalized:', this.selectedAccount);
      // Additional logic after account selection
      this.stateGlobal.selectedAccount = account;
    },
    // provide('walletState', stateGlobal);
    disconnectWallet() {
      this.isConnected = false;
      this.accounts = [];
      this.selectedAccountAddress = '';
      this.selectedAccount = null;
      // Additional logic for disconnecting or deauthorizing the app might be necessary
    },
    resetConnection() {
      this.disconnectWallet();
    },

  },

};
</script>
  