<template>
    <div>
        <NuxtLayout>
            <!-- <div> -->
            <p>Home page</p>
            <!-- </div> -->
            <div>
                <button @click="loadData">Load Data</button>
                <p v-if="data">{{ data.message }}</p>
            </div>
        </NuxtLayout>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const data = ref(null);
const collectionName = 'aiweb3-inscription';
const loadData = async () => {
    //   const response = await fetch('api/firebase/fetch?collectionName=${collectionName}');
    // const response = await fetch('api/firebase/fetch-data', {
    //     collectionName: collectionName
    // })
    // const response = await fetch('api/firebase/fetch-data', {
    //     collectionName: collectionName
    // })
    const response = await $fetch(
        'api/firebase/fetch-data',
        {
            method: 'post',
            body: { 
                collectionName: collectionName,
                // docId:'Q&A',
                rowData:[

                ] 
            }
        }
    )
    console.log('response',response)
    // if (response.ok) {
    //     console.log
    //     data.value = await response.json();
    // } else {
    //     console.error('Failed to fetch data');
    // }
};
</script>