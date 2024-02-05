

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
import {useWalletStore} from  '@/stores/polkadot-wallet';
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
        
        const { $polkadotApi } = useNuxtApp();
        
        const fetchQuestion = async () => {
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
            
        
            const walletStore = useWalletStore();
            console.log('walletStore', walletStore.selectedAccount);
            const selectedAccount = walletStore.selectedAccount;
            
            try {
          
                // Create a remark transaction
                const tx = $polkadotApi.tx.system.remark(JSON.stringify('123'));
                const wallet = walletStore.selectedWallet
                const walletExtension = window.injectedWeb3[wallet]
                const extension = await walletExtension.enable()
                
                const unsub = await tx.signAndSend(selectedAccount.address, { signer: extension.signer }, ({ status }) => {
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
  