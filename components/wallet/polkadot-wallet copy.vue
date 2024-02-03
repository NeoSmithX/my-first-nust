<template>
    <div>
      <button v-if="!isConnected" @click="connectWallet">Connect to SubWallet</button>
      <div v-if="isConnected">
        <p>Wallet connected: {{ account.address }}</p>
        <button @click="disconnectWallet">Disconnect</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isConnected: false,
        account: {},
        extension: null,
      };
    },
    methods: {
      async connectWallet() {
        try {
          // Ensure this runs only client-side
          if (typeof window !== 'undefined' && window.injectedWeb3 && window.injectedWeb3['subwallet-js']) {
            const SubWalletExtension = window.injectedWeb3['subwallet-js'];
            const extension = await SubWalletExtension.enable();
            this.extension = extension; // Store the extension for later use
  
            if (extension && extension.accounts) {
              const accounts = await extension.accounts.get();
              if (accounts && accounts.length > 0) {
                this.account = accounts[0]; // Use the first account
                this.isConnected = true;
              } else {
                console.log('No accounts found.');
              }
            }
          }
        } catch (error) {
          console.error('Failed to connect to SubWallet:', error);
        }
      },
      disconnectWallet() {
        this.isConnected = false;
        this.account = {};
        // Additional logic for properly disconnecting or deauthorizing the app may be required
      },
    },
  };
  </script>
  