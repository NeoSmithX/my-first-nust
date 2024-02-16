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
<script setup lang="ts">
import { ref } from 'vue';
import updateData from '~/composables/firebase/update-data'
import fetchData from '~/composables/firebase/fetch-data';
import type { InputFetch } from '~/types/firebase';
const data: any = ref(null);
const collectionName = 'aiweb3-inscription';
const testButton = async () => {
    const x = await fetchData(
        {
            collectionName: collectionName,
            docId: 'Q&A'
        }

    )
    console.log('x', x);
    const storeData: InputFetch = {
        collectionName: collectionName,
        rowData: {
            space: 'test',
        }
    }
    await updateData(storeData)

};
</script>