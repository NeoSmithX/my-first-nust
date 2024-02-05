import admin from 'firebase-admin';
// const serviceAccountPath = '~/private-data/aiweb3-inscription-firebase-adminsdk-ikolg-21fa3f0671.json';
// import serviceAccount from '~/private-data/aiweb3-inscription-firebase-adminsdk-ikolg-21fa3f0671.json';
// const serviceAccount = await import (serviceAccountPath)
const serviceAccount = JSON.parse(process.env.firebaseAccountKey as string)
// console.log('serviceAccount', serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any)
});
export const db = admin.firestore();