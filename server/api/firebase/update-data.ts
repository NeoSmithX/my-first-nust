
import { db } from './admin-init';
import { defineEventHandler } from 'h3';
import type { InputFetch, ReturnFetch } from '~/types/firebase';

export default defineEventHandler(async (event) => {
  const returnFetch: ReturnFetch = {
    status: false,
    dataArray: []
  }
  const body = await readBody(event) as InputFetch
  const collectionName = body.collectionName
  const rowData = body.rowData 
  if (!rowData){

    return returnFetch
  }
  const docId = body.docId 
  const collectionRef = db.collection(collectionName)// collection(db,collectionName) //await db.collection(collectionName).get();
  if (docId) {
    // Update the existing document with the provided docId
    try {
      await collectionRef.doc(docId).set(rowData, { merge: true });
      console.log(`Document with ID ${docId} updated successfully.`);
      returnFetch.status = true
    } catch (error) {
      console.error('Error updating document:', error);
    }
  } else {
    // Add a new document and let Firestore generate the docId
    try {
      const docRef = await collectionRef.add(rowData);
      returnFetch.status = true
      console.log(`New document added with ID ${docRef.id}.`);
    } catch (error) {
      console.error('Error adding new document:', error);
    }
  }
  return returnFetch


})
