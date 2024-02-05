// import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './admin-init';
import { defineEventHandler } from 'h3';


export default defineEventHandler(async (event) => {
    // console.log('event', event)
    // Access query parameters
    // return 'Hello World'
    const body = await readBody(event)
    const collectionName = body.collectionName as string
    const rowData = body.rowData as any[]
    const docId = body.docId as string
    if (docId){
        const docRef = db.collection(collectionName).doc(docId);
        const doc = await docRef.get();
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          return doc.data();
        }
    }
    const collectionRef = db.collection(collectionName)// collection(db,collectionName) //await db.collection(collectionName).get();
    const fetchedDocs:any = [];
    if (rowData == undefined || rowData.length == 0){
        const snapshot = await collectionRef.get();
    snapshot.forEach(doc => {
      fetchedDocs.push(doc.data());
    });
    return fetchedDocs; // Return all documents in the collection
    }
    

    for (const queryField of rowData) {
      const fieldName = Object.keys(queryField)[0]; // Get the field name
      const fieldValue = queryField[fieldName]; // Get the corresponding value
  
      const snapshot = await collectionRef.where(fieldName, '==', fieldValue).get();
  
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          fetchedDocs.push(doc.data());
        });
      } else {
        console.log(`No document found with ${fieldName} == ${fieldValue}`);
      }
    }
  
    return fetchedDocs;
    

})
// the body has property {
//     collectionName:xx,
//     rowData:[
//         {a:1},
//         {b:2}
//         ...
//     ]
// }