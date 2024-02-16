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
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { useWalletStore } from '~/stores/polkadot-wallet';
import updateData from '~/composables/firebase/update-data'
import type { InputFetch } from '~/types/firebase';
import { ApiPromise, WsProvider } from '@polkadot/api'
// const { nuxtApp } = useNuxtApp();
// Change the file extension from .vue to .ts
// import type { InputFetch, ReturnFetch } from '~/types/firebase';
// console.log('env',useRuntimeConfig())
// import { useRuntimeConfig } from '@nuxt/runtime';
import { useRuntimeConfig } from "#imports"
const adminWhitelistAddress = JSON.parse((useRuntimeConfig() as any).public.PUBLIC_adminList);
// const adminWhitelistAddress = JSON.parse(process.env.PUBLIC_adminList);

const selectedSpace = ref('');
const selectedQuestionId = ref('');
const selectedQuestion = ref('');
const question = ref('');
const latestBlock = ref(null);
const transactionStatus = ref(''); // 'pending', 'success', 'failed'
const transactionHash = ref('');
const transactionError = ref('');
const { $polkadotApi } = useNuxtApp() as any;

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

    

    //
    const inscriptionData = {
        p: 'drc-20-aiweb3',
        op: 'deploy-question',
        space: selectedSpace.value,
        questionId: selectedQuestion.value,
    }
    
    const remarkPayload = JSON.stringify(inscriptionData);


    //
    //test
    
    
    // test end
    try {
        transactionStatus.value = 'pending';
        const tx = await $polkadotApi.tx.system.remark(remarkPayload);
        const wallet = walletStore.selectedWallet
        const walletExtension = (window as any).injectedWeb3[wallet]
        const extension = await walletExtension.enable()
        // console.log('tx',tx)
        // console.log('selectedAccount',selectedAccount)
        if (!selectedAccount.value){
            console.error('No account selected');
            return;
        }
        const unsub = await tx.signAndSend(selectedAccount.value.address, { signer: extension.signer }, async ({ status }: any) => {
            if (status.isInBlock) {
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
                transactionStatus.value = 'success';
                transactionHash.value = status.asInBlock.toString();
                // store to database
                //
                const storeData:InputFetch = {
                    collectionName: 'aiweb3-inscription',
                    rowData:{
                        space: selectedSpace.value,
                        // questionId: selectedQuestion.value,
                        // question: selectedQuestion.value,
                        blockHash: transactionHash.value,
                        status: 'deployed',
                        inscriptionData: inscriptionData,
                    
                    }
                }
                await updateData(storeData)
                console.log('data is stored into database: ',storeData)
                unsub();
            } 
        }).catch((error:any) => {
            console.error('Transaction failed:', error);
            transactionStatus.value = 'failed';
            transactionError.value = error.toString();
        });
      
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};
</script>

  