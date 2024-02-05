
import { db } from './admin-init';
import { defineEventHandler } from 'h3';


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const collectionName = body.collectionName as string
    const rowData = body.rowData as any[]
    const docId = body.docId as string
    const collectionRef = db.collection(collectionName)// collection(db,collectionName) //await db.collection(collectionName).get();
    if (docId) {
        // Update the existing document with the provided docId
        try {
          await collectionRef.doc(docId).set(rowData, { merge: true });
          console.log(`Document with ID ${docId} updated successfully.`);
        } catch (error) {
          console.error('Error updating document:', error);
        }
      } else {
        // Add a new document and let Firestore generate the docId
        try {
          const docRef = await collectionRef.add(rowData);
          console.log(`New document added with ID ${docRef.id}.`);
        } catch (error) {
          console.error('Error adding new document:', error);
        }
      }
    

})
