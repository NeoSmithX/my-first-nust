import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './init';
import { defineEventHandler } from 'h3';


export default defineEventHandler(async (event) => {
    // console.log('event', event)
    // Access query parameters
    // return 'Hello World'
    const body = await readBody(event)
    const collectionName = body.collectionName as string
    const rowData = body.rowData as any[]
    const collectionRef =  collection(db,collectionName) //await db.collection(collectionName).get();
    let fetchedDocs:any = [];
    // const querySnapshot = await getDocs(collectionRef)
    // console.log('querySnapshot', querySnapshot);
    if (rowData == undefined){
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach(doc => {
            const docData = { id: doc.id, ...doc.data() };
            fetchedDocs.push(docData);
        });
        return fetchedDocs
    }else{
        for (const element of rowData) {
            const field = Object.keys(element)[0];
            const value = element[field];
            
            const q = query(collectionRef, where(field, "==", value));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach(doc => {
                const docData = { id: doc.id, ...doc.data() };
                // Avoid duplicates
                if (!fetchedDocs.some((fetchedDoc: { id: string; }) => fetchedDoc.id === docData.id)) {
                    fetchedDocs.push(docData);
                }
            });
        }
    
    
      
        return fetchedDocs
    }
    

})
// the body has property {
//     collectionName:xx,
//     rowData:[
//         {a:1},
//         {b:2}
//         ...
//     ]
// }