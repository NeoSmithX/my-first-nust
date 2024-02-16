<template>
    <div>
        <NuxtLayout>
            <!-- <div> -->
            <p>Home page</p>
            <!-- </div> -->
            <div>
                <button @click="testButton">Load Data</button>
                <p v-if="data">{{ data.message }}</p>
            </div>
        </NuxtLayout>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const data = ref(null);
const collectionName = 'aiweb3-inscription';
const testButton = async () => {
   
    const response = await $fetch(
        'api/firebase/fetch-data',
        {
            method: 'post',
            body: { 
                collectionName: collectionName,
                // docId:'Q&A',
                rowData:{
                    
                }
            }
        }
    )
    console.log('response',response)
 
};
</script>