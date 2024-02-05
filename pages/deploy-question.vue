<template>
    <div>
        <NuxtLayout>
            <div>
                <div>
                    <label for="space-input">Enter a space:</label>
                    <input v-model="selectedSpace" id="space-input" />
                </div>

                <div>
                    <label for="question-input">Enter Question:</label>
                    <input v-model="selectedQuestion" id="question-input" />
                </div>

                <div v-if="question">
                    <p>Question: {{ question }}</p>
                </div>

                <div>
                    <button @click="sendTransaction" :disabled="transactionStatus === 'pending' || !selectedSpace || !selectedQuestion">Deploy Question
                        <!-- !isWhitelisted || -->
                    </button>

                    <p v-if="transactionStatus === 'pending'">Transaction is pending...</p>
                    <p v-if="transactionStatus === 'success'">Transaction successful! Hash: {{ transactionHash }}</p>
                    <p v-if="transactionStatus === 'failed'">Transaction failed: {{ transactionError }}</p>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { useWalletStore } from '~/stores/polkadot-wallet';
const adminWhitelistAddress = JSON.parse(process.env.adminList);
const selectedSpace = ref('');
const selectedQuestionId = ref('');
const selectedQuestion = ref('');
const question = ref('');
const latestBlock = ref(null);
const transactionStatus = ref(''); // 'pending', 'success', 'failed'
const transactionHash = ref('');
const transactionError = ref('');
const { $polkadotApi } = useNuxtApp();
import App from '~/app.vue'
import { createPinia } from 'pinia';
import { createApp } from 'vue'
// const pinia = createPinia()
// const app = createApp(App)
// app.use(pinia)
const walletStore = useWalletStore();
const selectedAccount = computed(() => walletStore.selectedAccount);

// Example whitelist of account addresses


const whitelist = adminWhitelistAddress.deployAuthority
const isWhitelisted = computed(() => {
    return whitelist.includes(selectedAccount.value?.address);
});



onMounted(() => {
    // Your existing logic here
});

const sendTransaction = async () => {
    // if (!isWhitelisted.value) {
    //     console.error('Selected account is not whitelisted.');
    //     return;
    // }

    const remarkPayload = JSON.stringify({
        p: 'drc-20-aiweb3',
        op: 'deploy-question',
        space: selectedSpace.value,
        questionId: selectedQuestion.value,
    });

    try {
        transactionStatus.value = 'pending';
        const tx = await $polkadotApi.tx.system.remark(remarkPayload);
        const wallet = walletStore.selectedWallet
        const walletExtension = window.injectedWeb3[wallet]
        const extension = await walletExtension.enable()
        // console.log('tx',tx)
        // console.log('selectedAccount',selectedAccount)
        const unsub = await tx.signAndSend(selectedAccount.value.address, { signer: extension.signer }, ({ status }) => {
            if (status.isInBlock) {
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
                transactionStatus.value = 'success';
                transactionHash.value = status.asInBlock.toString();

                unsub();
            } 
        }).catch((error) => {
            console.error('Transaction failed:', error);
            transactionStatus.value = 'failed';
            transactionError.value = error.toString();
        });
      
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};
</script>

  