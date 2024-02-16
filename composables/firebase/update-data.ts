import { collection, getDocs, query, where, addDoc, setDoc, doc } from 'firebase/firestore';
// import $db from '~/plugins/firebase-init';
// import { defineEventHandler } from 'h3';
// import { inject } from 'vue';

import type { InputFetch, ReturnFetch } from '~/types/firebase';
const updateData = async (args: InputFetch):Promise<ReturnFetch> => {
    
    // const $db = inject('$db') as any;
    const { $db } = useNuxtApp() as any
    // const db = $db
    const collectionName = args.collectionName 
    const docId = args.docId 
    const rowData = args.rowData 
    console.log('$db ', $db)
    const collectionRef = collection($db, collectionName) //await $db.collection(collectionName).get();
    const returnFetch: ReturnFetch = { status: false, dataArray: [] };
    // let fetchedDocs: any = [];
    console.log('args', args)
    if (docId) {
        // Update the existing document with the provided docId
        console.log('Update the existing document with the provided docId')
        try {
            await setDoc(doc($db,collectionName,docId), rowData, { merge: true });
            // await collectionRef.doc(docId).set(rowData, { merge: true });
            console.log(`Document with ID ${docId} updated successfully.`);
            returnFetch.status = true
        } catch (error) {
            console.error('Error updating document:', error);
        }
    } else {
        // Add a new document and let Firestore generate the docId
        console.log('Add a new document and let Firestore generate the docId')
        try {
            const docRef = await addDoc(collectionRef, rowData)
            //await  collectionRef.add(rowData);
            console.log(`New document added with ID ${docRef.id}.`);
            returnFetch.status = true
        } catch (error) {
            console.error('Error adding new document:', error);
        }
    }
    return returnFetch


}
export default updateData