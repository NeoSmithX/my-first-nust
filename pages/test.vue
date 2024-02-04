

<template>
    <div>
        <NuxtLayout>
            <div>
                <div>
                    <label for="space-select">Choose a space:</label>
                    <select v-model="selectedSpace" id="space-select">
                        <!-- Assuming you have predefined options for spaces -->
                        <option value="space1">Space 1</option>
                        <option value="space2">Space 2</option>
                    </select>
                </div>

                <div>
                    <label for="questionId-select">Choose Question ID:</label>
                    <select v-model="selectedQuestionId" id="questionId-select">
                        <!-- Assuming you have predefined options for question IDs -->
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>

                <div v-if="question">
                    <p>Question: {{ question }}</p>
                </div>
                <!-- <div>here</div> -->
                <div v-if="latestBlock">
                    <p>Latest Block Number: {{ latestBlock }}</p>
                </div>

                <div>
                    <button @click="sendTransaction">Send Remark Transaction</button>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>
  
<script>
import { ref, watchEffect } from 'vue';
import { onMounted, inject } from 'vue';
import { useNuxtApp } from '#app';
// import { usePolkadotWalletStore } from '@/stores/polkadot-wallet';
// import { web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
// import { computed } from 'vue';
export default {
    name: 'QuestionCard',
    setup() {
        const selectedSpace = ref('');
        const selectedQuestionId = ref('');
        const question = ref('');
        const latestBlock = ref(null);
        // console.log('useNuxtApp', useNuxtApp().vueApp.component('polkadotWallet'));
        const { $polkadotApi } = useNuxtApp();
        // const { $polkadotWalletState } = useNuxtApp();
        // console.log('polkadotWalletState', $polkadotWalletState);
        const polkadotWalletState = inject('polkadotWalletState');
        // const polkadotWalletStore = usePolkadotWalletStore(); 
        // const signer = computed(() => {
        //     if (walletStore.selectedAccount) {
        //         // The getSignerForAccount function would need to be implemented based on your wallet logic
        //         // and how you obtain a signer object from the selected account.
        //         return getSignerForAccount(walletStore.selectedAccount.address);
        //     }
        //     return null;
        // });
        // Simulate fetching question based on selected options
        const fetchQuestion = async () => {
            // Placeholder for fetching logic
            // For example: `question.value = await fetchQuestionFromAPI(selectedSpace.value, selectedQuestionId.value)`
            question.value = `Question for space ${selectedSpace.value} and question ID ${selectedQuestionId.value}`;
        };

        watchEffect(() => {
            if (selectedSpace.value && selectedQuestionId.value) {
                fetchQuestion();
            } else {
                question.value = ''; // Reset question if selections are not complete
            }
        });
        async function fetchLatestBlock() {
            if ($polkadotApi) {
                try {
                    //   const lastHeader = await this.$polkadotApi.query.system.number();
                    latestBlock.value = await $polkadotApi.query.system.number(); //lastHeader.number.toNumber(); // Storing the block number
                } catch (error) {
                    console.error('Failed to fetch the latest block:', error);
                }
            }
        }
        onMounted(() => {
            fetchLatestBlock();
        });
        // const selectedAccount = inject('selectedAccount');
        const sendTransaction = async () => {
            console.log('Trying to send transaction');
            
        console.log('polkadotWalletState', polkadotWalletState);
            // const polkadotWallet =  useNuxtApp().vueApp.component('polkadotWallet');
            // console.log('polkadotWallet', polkadotWallet);
            // const selectedAccount = inject('selectedAccount');
            // const { PolkadotWallet } = useNuxtApp();
            // console.log('PolkadotWallet', PolkadotWallet);
            
            // console.log('selectedAccount', selectedAccount);
            // const x = polkadotWallet.selectedWalletName
            // console.log('x', x)
            return
            // const injector = await web3FromAddress(polkadotWalletStore.selectedAccount.address);
            // if (!window.injectedWeb3['subwallet-js']) {
            //     console.error("SubWallet extension not found");
            //     return;
            // }

            // const SubWalletExtension = window.injectedWeb3['subwallet-js'];
            // const extension = await SubWalletExtension.enable();

            // // Ensure you have accounts from the extension to use
            // if (!extension.accounts || extension.accounts.length === 0) {
            //     console.error("No accounts found in the extension");
            //     return;
            // }else{
            //     console.log('Accounts found in the extension', extension.accounts);
            // }

            // Assuming you select the first account as the sender
            // const senderAddress = extension.accounts[0].address;
            try {
                // Ensure the API is connected and ready
                // await $polkadotApi.isReady;

                // Create a remark transaction
                const tx = $polkadotApi.tx.system.remark(JSON.stringify('123'));

                // Sign and send the transaction
                // Replace `YOUR_ACCOUNT_ADDRESS` with the sender's account address
                // and `signer` with an instance of the account's signer

                console.log('injector.selectedAccount', injector.selectedAccount);
                const unsub = await tx.signAndSend(injector.selectedAccount.address, { signer: injector.selectedAccount.address.signer }, ({ status }) => {
                    if (status.isInBlock) {
                        console.log(`Transaction included at blockHash ${status.asInBlock}`);
                        unsub();
                    }
                });

            } catch (error) {
                console.error('Transaction failed:', error);
            }
        }
        return {
            selectedSpace,
            selectedQuestionId,
            question,
            latestBlock,
            sendTransaction
        };
    },
};
</script>
  