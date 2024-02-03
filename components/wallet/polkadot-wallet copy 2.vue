<template>
    <div>
        <!-- Trigger Button -->
        <button @click="showWalletSelection = true">Connect Wallet</button>

        <!-- Wallet Selection Modal -->
        <div v-if="showWalletSelection">
            <p>Select a Wallet:</p>
            <button v-for="wallet in wallets" :key="wallet.id" @click="connectWallet(wallet.id)">
                {{ wallet.name }}
            </button>
        </div>

        <!-- Account Selection Modal -->
        <div v-if="isConnected && accounts.length">
            <p>Select an Account:</p>
            <select v-model="selectedAccount">
                <option v-for="account in accounts" :key="account.address" :value="account.address">
                    {{ account.name }} ({{ account.address }})
                </option>
            </select>
            <button @click="finalizeConnection">Confirm</button>
        </div>
    </div>
</template>
  
  
<script>
export default {
    data() {
        return {
            wallets: [
                { id: 'subwallet-js', name: 'SubWallet' },
                { id: 'polkadot-js', name: 'Polkadot{.js}' },
                { id: 'talisman', name: 'Talisman' }
            ],
            showWalletSelection: false,
            isConnected: false,
            accounts: [],
            selectedAccount: '',
        };
    },
    methods: {
        async connectWallet(walletId) {
            // This method would use the wallet's API to request access
            // For demonstration, using a placeholder approach
            if (typeof window !== 'undefined' && window.injectedWeb3 && window.injectedWeb3[walletId]) {
                const WalletExtension = window.injectedWeb3[walletId];
                try {
                    const extension = await WalletExtension.enable();
                    this.isConnected = true;
                    this.showWalletSelection = false; // Hide wallet selection
                    // Fetch accounts from the connected wallet
                    this.accounts = await this.fetchAccounts(extension);
                } catch (error) {
                    console.error(`Failed to connect to ${walletId}:`, error);
                    this.isConnected = false;
                }
            }
        },
        async fetchAccounts(extension) {
            // Placeholder for fetching accounts from the extension
            // Replace with actual API calls provided by the wallet extension
            return extension.accounts.get();
        },
        finalizeConnection() {
            // Logic to finalize connection with the selected account
            console.log('Selected account:', this.selectedAccount);
            // You can now use this.selectedAccount for further operations
        }
    }
};
</script>

  