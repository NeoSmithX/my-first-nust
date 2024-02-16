// import { collection, getDocs, query, where } from 'firebase/firestore';
import type { InputFetch, ReturnFetch } from '~/types/firebase';
import { db } from './admin-init';
import { defineEventHandler } from 'h3';
import type { CollectionReference, DocumentData, Query } from '@google-cloud/firestore';


export default defineEventHandler(async (event) : Promise<ReturnFetch> => {
  // console.log('event', event)
  // Access query parameters
  // return 'Hello World'
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






  ////////////////
  // if (docId) {
  //   const docRef = db.collection(collectionName).doc(docId);
  //   const doc = await docRef.get();
  //   if (!doc.exists) {
  //     console.log('No such document!');
  //   } else {
  //     console.log('Document data:', doc.data());
  //     return doc.data();
  //   }
  // }
  // const collectionRef = db.collection(collectionName)// collection(db,collectionName) //await db.collection(collectionName).get();
  // const fetchedDocs: any = [];
  // if (rowData == undefined) {
  //   const snapshot = await collectionRef.get();
  //   snapshot.forEach(doc => {
  //     fetchedDocs.push(doc.data());
  //   });
  //   return fetchedDocs; // Return all documents in the collection
  // }


  // for (const fieldName of Object.keys(rowData) ) {
  //   // const fieldName = Object.keys(queryField)[0]; // Get the field name
  //   const fieldValue = rowData[fieldName]; // Get the corresponding value

  //   const snapshot = await collectionRef.where(fieldName, '==', fieldValue).get();

  //   if (!snapshot.empty) {
  //     snapshot.forEach(doc => {
  //       fetchedDocs.push(doc.data());
  //     });
  //   } else {
  //     console.log(`No document found with ${fieldName} == ${fieldValue}`);
  //   }
  // }

  // return fetchedDocs;


})
// the body has property {
//     collectionName:xx,
//     rowData:[
//         {a:1},
//         {b:2}
//         ...
//     ]
// }