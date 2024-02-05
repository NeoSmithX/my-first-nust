import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from './init';
import { defineEventHandler } from 'h3';

// Example function to get documents from a Firestore collection
// export  async function fetchData(collectionName?: string) {
//     if (!collectionName) {
//         collectionName = 'aiweb3-inscription'
//     }
//     // const result = await db.collection(collectionName).get();
//     const querySnapshot = await getDocs(collection(db,collectionName));
//     console.log('querySnapshot', querySnapshot);
//     const dataList: any[] = [];
//     querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         dataList.push(doc.data());
//     });
//     return dataList;
// }
export default defineEventHandler(async (event) => {
    // console.log('event', event)
    // Access query parameters
    // return 'Hello World'
    const body = await readBody(event)
    const collectionName = body.collectionName as string
    const searchIndex = body.searchIndex as any[]
    const collectionRef = collection(db,collectionName) //await db.collection(collectionName).get();
    let fetchedDocs:any = [];
    // const querySnapshot = await getDocs(collectionRef)
    // console.log('querySnapshot', querySnapshot);
    if (searchIndex == undefined){
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach(doc => {
            const docData = { id: doc.id, ...doc.data() };
            fetchedDocs.push(docData);
        });
        return fetchedDocs
    }else{
        for (const searchCondition of searchIndex) {
            const field = Object.keys(searchCondition)[0];
            const value = searchCondition[field];
            
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

const updateNewData = async (collectionName: string, data: any) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id

}
// the body has property {
//     collectionName:xx,
//     searchIndex:[
//         {a:1},
//         {b:2}
//         ...
//     ],
//     
// }