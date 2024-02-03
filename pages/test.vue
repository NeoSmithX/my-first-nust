

<template>
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
            <!-- <div >here</div>
      <div v-if="latestBlock">
        <p>Latest Block Number: {{ latestBlock }}</p>
      </div> -->
        </div>
    </NuxtLayout>
</template>
  
<script>
import { ref, watchEffect } from 'vue';
import { onMounted } from 'vue';
export default {
    name: 'QuestionCard',
    setup() {
        const selectedSpace = ref('');
        const selectedQuestionId = ref('');
        const question = ref('');
        const latestBlock = ref(null);
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
            if (this.$polkadotApi) {
                try {
                    //   const lastHeader = await this.$polkadotApi.query.system.number();
                    latestBlock.value = await this.$polkadotApi.query.system.number(); //lastHeader.number.toNumber(); // Storing the block number
                } catch (error) {
                    console.error('Failed to fetch the latest block:', error);
                }
            }
        }
        onMounted(() => {
            fetchLatestBlock();
        });

        return {
            selectedSpace,
            selectedQuestionId,
            question,
            latestBlock
        };
    },
};
</script>
  