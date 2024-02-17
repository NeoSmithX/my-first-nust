<template>
    <div>
        <NuxtLayout>
            <div class="minting-answer">
                <div>
                    <label for="space-input">Enter a space:</label>
                    <input v-model="selectedSpace" id="space-input" />
                    <button @click="fetchQuestions" :disabled="selectedSpace == ''">Fetch Questions</button>
                </div>

                <div v-if="questions.length">
                    <label for="question-select">Choose a Question:</label>
                    <select v-model="selectedQuestion" id="question-select">
                        <option v-for="question in questions" :key="question.id" :value="question.text">
                            {{ question.text }}
                        </option>
                    </select>
                </div>

                <div v-if="selectedQuestion">
                    <label for="answer-input">Enter your answer:</label>
                    <input v-model="answer" id="answer-input" />
                </div>

                <div>
                    <button @click="submitAnswer" :disabled="!answer || !selectedQuestion">Submit Answer</button>
                    <p v-if="transactionStatus === 'pending'">Transaction is pending...</p>
                    <p v-if="transactionStatus === 'success'">Transaction successful! Hash: {{ transactionHash }}</p>
                    <p v-if="transactionStatus === 'failed'">Transaction failed: {{ transactionError }}</p>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useWalletStore } from '~/stores/polkadot-wallet';
import fetchData from '~/composables/firebase/fetch-data';
// Assume you have a composable or utility function for interacting with your blockchain and database
//   import { fetchQuestionsForSpace, submitAnswerToBlockchain } from '~/composables/blockchain';

const selectedSpace = ref('');
const questions: any = ref([]);
const selectedQuestion = ref('');
const answer = ref('');

const transactionStatus = ref(''); // 'pending', 'success', 'failed'
const transactionHash = ref('');
const transactionError = ref('');
const { $polkadotApi } = useNuxtApp() as any;

const walletStore = useWalletStore();
const selectedAccount = computed(() => walletStore.selectedAccount);
async function fetchQuestions() {
    // This function should fetch questions based on the selected space
    const data = await fetchData({
        collectionName: 'aiweb3-inscription',
        rowData: {
            space: selectedSpace.value,
        }
    });
    // console.log('data', data);
    data.dataArray.forEach((x) => {
        // console.log('??','inscriptionData' in x.rowData)
        if ('inscriptionData' in x.rowData) {

            if ((x.rowData.inscriptionData as any).op == 'deploy-question' && (x.rowData.inscriptionData as any).p == 'drc-20-aiweb3') {
                questions.value.push({
                    text: (x.rowData.inscriptionData as any).question, id: x.docId
                })

            }


            // if ('question' in element.rowData.inscriptionData){}
            // questions.push({ content: (element.rowData as any).question, docId: element.docId });
        }

    });
    console.log('questions', questions);
    // questions.value = await fetchQuestionsForSpace(selectedSpace.value);
}

async function submitAnswer() {
    const inscriptionData = {
        p: 'drc-20-aiweb3',
        op: 'mint-answer',
        space: selectedSpace.value,
        question: selectedQuestion.value,
        answer: answer.value
    }

    const remarkPayload = JSON.stringify(inscriptionData);
    try {
        transactionStatus.value = 'pending';
        const tx = await $polkadotApi.tx.system.remark(remarkPayload);
        const wallet = walletStore.selectedWallet
        const walletExtension = (window as any).injectedWeb3[wallet]
        const extension = await walletExtension.enable()
        // console.log('tx',tx)
        // console.log('selectedAccount',selectedAccount)
        if (!selectedAccount.value) {
            console.error('No account selected');
            return;
        }
        const unsub = await tx.signAndSend(selectedAccount.value.address, { signer: extension.signer }, async ({ status }: any) => {
            if (status.isInBlock) {
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
                transactionStatus.value = 'success';
                transactionHash.value = tx.hash.toHex()
               
                unsub();
            }
        }).catch((error: any) => {
            console.error('Transaction failed:', error);
            transactionStatus.value = 'failed';
            transactionError.value = error.toString();
        });

    } catch (error) {
        console.error('Transaction failed:', error);
    }
}
</script>
  