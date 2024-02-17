<template>
    <div>
        <NuxtLayout>

            <!-- Admin Section -->
            <!-- <div v-if="isAdmin">
                <h2>Admin Dashboard</h2>
                <input v-model="spaceName" placeholder="Enter space name" />
                <button @click="fetchQuestions">Fetch Questions</button>

                <select v-model="selectedQuestion" v-if="questions.length > 0">
                    <option disabled value="">Please select one</option>
                    <option v-for="question in questions" :key="question.id" :value="question">
                        {{ question.text }}
                    </option>
                </select>

                <div v-if="selectedQuestion">
                    <input v-model="correctAnswer" placeholder="Enter correct answer" />
                    <input v-model.number="winnerNumber" type="number" placeholder="Enter winner number" />
                    <button @click="createWinnerList">Create Winner</button>
                </div>
            </div> -->

            <!-- User Section -->
            <div>
                <h2>User Dashboard</h2>
                <input v-model="spaceName" placeholder="Enter space name" />
                <button @click="fetchQuestions">Fetch Questions</button>

                <select v-model="selectedQuestion" v-if="questions.length > 0">
                    <option disabled value="">Please select one</option>
                    <option v-for="question in questions" :key="question.id" :value="question">
                        {{ question.text }}
                    </option>
                </select>

                <div v-if="selectedQuestion">
                    <button @click="fetchWinnerList">Show Winner</button>
                    <button @click="createWinnerList" :disabled='false'>Create Winner</button>
                </div>
                <div v-if="showWinnerInputFields">
                    <input v-model="correctAnswer" placeholder="Correct Answer" />
                    <input v-model.number="winnerNumber" placeholder="Winner Number" type="number" />
                    <button @click="submitWinnerDetails">Create</button>
                </div>
                <div v-if="winnerList.length > 0">
                    <h3>Winner List</h3>
                    <ul>
                        <li v-for="winner in winnerList" :key="winner.id">{{ winner }}</li>
                    </ul>
                </div>
                <div v-else-if="winnerListFetched">Winner not existed</div>
            </div>

        </NuxtLayout>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
//   import { createWinner, fetchWinner } from '@/api'; // Adjust the import path accordingly
import fetchData from '~/composables/firebase/fetch-data';
import updateData from '~/composables/firebase/update-data';
import type { InputFetch } from '~/types/firebase';
const spaceName = ref('');
const questions: any = ref([]);
const selectedQuestion = ref(null);
const correctAnswer = ref('');
const winnerNumber = ref(0);
const winnerList: any = ref([]);
const winnerListFetched = ref(false);
const showWinnerInputFields = ref(false);
// Dummy condition to differentiate between admin and user
// Replace this with your actual condition
const x = 1;
const isAdmin = ref(x === 1); // Assuming 'x' is defined somewhere in your logic

async function fetchQuestions() {
    // This function should fetch questions based on the selected space
    const data = await fetchData({
        collectionName: 'aiweb3-inscription',
        rowData: {
            space: spaceName.value,
        }
    });
    // console.log('data', data);
    data.dataArray.forEach((x) => {
        // console.log('hash:', (x.rowData as any).deployHash)
        if ('inscriptionData' in x.rowData) {

            if ((x.rowData.inscriptionData as any).op == 'deploy-question' && (x.rowData.inscriptionData as any).p == 'drc-20-aiweb3') {
                questions.value.push({
                    text: (x.rowData.inscriptionData as any).question,
                    id: x.docId,
                    deployHash: (x.rowData as any).deployHash,
                    winnerList: (x.rowData as any).winnerList
                })

            }


            // if ('question' in element.rowData.inscriptionData){}
            // questions.push({ content: (element.rowData as any).question, docId: element.docId });
        }

    });
    console.log('questions', questions);
    // questions.value = await fetchQuestionsForSpace(selectedSpace.value);
}

async function createWinnerList() {
    showWinnerInputFields.value = true;
}
async function submitWinnerDetails() {
    if (!selectedQuestion.value || !correctAnswer.value || !winnerNumber.value) {
        alert('Please fill all fields');
        return;
    }
    const body = {
        network: 'astar',
        deployHash: (selectedQuestion.value as any).deployHash,
        correctAnwser: correctAnswer.value,
        winnerNum: winnerNumber.value
    }
    // console.log('selectedQuestion',selectedQuestion)
    // console.log('body', body);
    const response = await fetch('/api/subscan/get-winner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const winner = await response.json();
    console.log('winner', winner);

    // store to database
    const storeData: InputFetch = {
        collectionName: 'aiweb3-inscription',
        docId: (selectedQuestion.value as any).id,
        rowData:{
            winnerList: winner.winnerList,
        }
    }
    await updateData(storeData)
}
async function fetchWinnerList() {
    if ((selectedQuestion.value as any).winnerList) {
        winnerList.value = (selectedQuestion.value as any).winnerList;
        console.log('winnerList', selectedQuestion.value);
    }
    // if (!selectedQuestion.value) {
    //     alert('Please select a question');
    //     return;
    // }
    // Assuming fetchWinner function takes the space name and question
    // winnerList.value = await fetchWinner(spaceName.value, selectedQuestion.value);
    winnerListFetched.value = true;
}
</script>
  
<style scoped>
/* Add your styles here */
</style>
  