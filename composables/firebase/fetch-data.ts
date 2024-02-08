import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/plugins/firebase-init';
// import { defineEventHandler } from 'h3';

const fetchData = async (collectionName: string, rowData?: any[]) => {
    const collectionRef =  collection(db,collectionName) //await db.collection(collectionName).get();
    let fetchedDocs:any = [];
   
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
}
export default fetchData



