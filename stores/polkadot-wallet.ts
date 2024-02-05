// stores/wallet.ts
import { defineStore } from 'pinia';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';

interface Account {
  address: string;
  name:string
  // meta: {
  //   name?: string;
  // };
}

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    selectedWallet: 'subwallet-js',
    isConnected: false,
    accounts: [] as Account[],
    selectedAccount: null as Account | null,
    selectedAccountAddress: '',
  }),
  getters: {
    selectedWalletName: (state) => {
      const walletNames: Record<string, string> = {
        'subwallet-js': 'SubWallet',
        'polkadot-js': 'Polkadot{.js}',
        'talisman': 'Talisman',
      };
      return walletNames[state.selectedWallet];
    },
  },

  actions: {
    initializeStore() {
      const isConnected = localStorage.getItem('isConnected') === 'true';
      const selectedWallet = localStorage.getItem('selectedWallet');
      if (isConnected && selectedWallet) {
        this.isConnected = isConnected;
        this.selectedWallet = selectedWallet;
        // Optionally, re-establish the connection or validate it here
      }
    },
    async connectWallet() {
      const selectedWallet = this.selectedWallet; // Assign to a local variable
      if (typeof window !== 'undefined' && (window as any).injectedWeb3 && (window as any).injectedWeb3[selectedWallet]) {
        // Now use 'selectedWallet' directly
        try {
          const walletExtension = (window as any).injectedWeb3[selectedWallet];
          const extension = await walletExtension.enable();
          const accounts = await extension.accounts.get();
          if (accounts.length > 0) {
            this.accounts = accounts.map((account: { address: any; name: any; }) => {
              // console.log('account', account)
              return ({
              
                address: account.address,
                // name: account.name,
                name: account.name, // Assuming 'meta' exists on the account
              })
            }
            
            );
            this.isConnected = true;
          } else {
            alert('No accounts found.');
          }
        } catch (error) {
          console.error(`Failed to connect to the wallet:`, error);
        }
      } else {
        alert(`Wallet extension for '${selectedWallet}' not found.`);
      }
    },
    finalizeConnection(selectedAccountAddress: string) {
      const account = this.accounts.find(acc => acc.address === selectedAccountAddress);
      if (account) {
        this.selectedAccount = account;
        this.selectedAccountAddress = selectedAccountAddress;
      }
    },
    disconnectWallet() {
      // Resets the state as before
      this.isConnected = false;
      this.accounts = [];
      this.selectedAccount = null;
      this.selectedAccountAddress = '';
    },
    resetConnection() {
      this.disconnectWallet();
    },
  },
});
