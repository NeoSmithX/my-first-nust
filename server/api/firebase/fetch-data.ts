// import { collection, getDocs, query, where } from 'firebase/firestore';
import type { InputFetch, ReturnFetch } from '~/types/firebase';
import { db } from './admin-init';
import { defineEventHandler } from 'h3';
import type { CollectionReference, DocumentData, Query } from '@google-cloud/firestore';


export default defineEventHandler(async (event) : Promise<ReturnFetch> => {

  const returnFetch: ReturnFetch = {
    status: false,
    dataArray: []
  }
  const body = await readBody(event) as InputFetch
  const collectionName = body.collectionName
  const rowData = body.rowData
  const docId = body.docId
  const collectionRef = db.collection(collectionName)
  if (docId) {
    // If docId is provided, fetch the document directly
    try {
      const docRef =collectionRef.doc(docId);
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {

        returnFetch.status = true
        returnFetch.dataArray.push({ docId: docSnapshot.id, rowData: docSnapshot.data() as object });
        
        return returnFetch

      } else {
        returnFetch.log = `No document found with ID ${docId}`;

        return returnFetch; // or handle document not found
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error; // or handle the error appropriately
    }
  } else {
    // If docId is not provided, query based on rowData
    if (!rowData) {
      returnFetch.log = 'No rowData';
      return returnFetch; // or handle the error appropriately
    }
    let query: Query<DocumentData> | CollectionReference<DocumentData> = collectionRef;
    for (const [key, value] of Object.entries(rowData)) {
      query = query.where(key, '==', value);
    }

    try {
      const querySnapshot = await query.get();
      // const results = [];
      querySnapshot.forEach(doc => {
        returnFetch.status = true
        returnFetch.dataArray.push({ docId: doc.id, rowData: doc.data() as object });
        // results.push({ docId: doc.id, data: doc.data() });
      });
      return returnFetch; // Could be an empty array if no documents match
    } catch (error) {
      console.error('Error querying documents:', error);
      // throw error; // or handle the error appropriately
    }
  }
  return returnFetch

})
// the body has property {
//     collectionName:xx,
//     rowData:[
//         {a:1},
//         {b:2}
//         ...
//     ]
// }