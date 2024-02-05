// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: useRuntimeConfig().apiKey,
//     authDomain: useRuntimeConfig().authDomain,
//     projectId: useRuntimeConfig().projectId,
//     storageBucket: useRuntimeConfig().storageBucket,
//     messagingSenderId: useRuntimeConfig().messagingSenderId,
//     appId: useRuntimeConfig().appId,
//     measurementId: useRuntimeConfig().measurementId
//   };
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
  // console.log('firebaseConfig', firebaseConfig)
  // Initialize Firebase
  export const myFirebase = initializeApp(firebaseConfig);
  export const db = getFirestore(myFirebase);
  // const analytics = getAnalytics(myFirebase);
  // myFirebase.automaticDataCollectionEnabled
  