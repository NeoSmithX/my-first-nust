import { collection, getDocs, query, where,doc,getDoc } from 'firebase/firestore';
// import db from '~/plugins/firebase-init';
import { inject } from 'vue';

// import { defineEventHandler } from 'h3';
import type { InputFetch, ReturnFetch } from '~/types/firebase';
const fetchData = async (inputFetch: InputFetch): Promise<ReturnFetch> => {
  const db = inject('db') as any;
    const { collectionName, rowData, docId } = inputFetch;
//   const db = getFirestore(); // Make sure to initialize Firestore
  const collectionRef = collection(db, collectionName);
  let returnFetch: ReturnFetch = { status: false, dataArray: [] };

  if (docId) {
    // If docId is provided, fetch the document directly
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        returnFetch.status = true;
        returnFetch.dataArray.push({ docId: docSnapshot.id, rowData: docSnapshot.data() as object });
        return returnFetch;
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
      returnFetch.log = 'No rowData provided for the query.';
      return returnFetch;
    }

    let queryConstraints: Array<any> = [];
    for (const [key, value] of Object.entries(rowData)) {
      queryConstraints.push(where(key, '==', value));
    }

    const queryInstance = query(collectionRef, ...queryConstraints);

    try {
      const querySnapshot = await getDocs(queryInstance);
      querySnapshot.forEach((doc) => {
        returnFetch.status = true;
        returnFetch.dataArray.push({ docId: doc.id, rowData: doc.data() as object });
      });
      return returnFetch;
    } catch (error) {
      console.error('Error querying documents:', error);
      // Adjust error handling as needed
      returnFetch.log = 'Error querying documents.';
      return returnFetch;
    }
  }
}
export default fetchData



