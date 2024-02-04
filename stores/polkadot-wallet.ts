// stores/wallet.ts
import { defineStore } from 'pinia';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { ref } from 'vue';
// import type { Account, WalletState } from '@/types'; // Adjust the import path as needed
interface Account {
  address: string;
  name: string;
}

interface WalletState {
  selectedWallet: string;
  isConnected: boolean;
  accounts: Account[];
  selectedAccount: Account | null;
}
export const usePolkadotWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    selectedWallet: '',
    isConnected: false,
    accounts: [],
    selectedAccount: null,
  }),
  actions: {
    async connectWallet() {
      console.log('Connecting to wallet...');
      this.isConnected = true;
      // Simulate fetching accounts
      this.accounts = [{ address: '5...', name: 'Account 1' }];
      this.selectedAccount = this.accounts[0];
    },

    disconnectWallet() {
      this.isConnected = false;
      this.accounts = [];
      this.selectedAccount = null;
    },

    selectAccount(address: string) {
      const account = this.accounts.find(acc => acc.address === address);
      if (account) {
        this.selectedAccount = account;
      }
    },

    resetConnection() {
      this.disconnectWallet();
    },
  },
});
