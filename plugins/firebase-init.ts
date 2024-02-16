// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// const adminWhitelistAddress = JSON.parse(useRuntimeConfig().public.PUBLIC_adminList);
// const firebaseConfig = {
//   apiKey: useRuntimeConfig().public.PUBLIC_apiKey,
//   authDomain: useRuntimeConfig().public.PUBLIC_authDomain,
//   projectId: useRuntimeConfig().public.PUBLIC_projectId,
//   storageBucket: useRuntimeConfig().public.PUBLIC_storageBucket,
//   messagingSenderId: useRuntimeConfig().public.PUBLIC_messagingSenderId,
//   appId: useRuntimeConfig().public.PUBLIC_appId,
//   measurementId: useRuntimeConfig().public.PUBLIC_measurementId
// };
 
// const myFirebase = initializeApp(firebaseConfig as any);
//  const db = getFirestore(myFirebase);
//  export default db

// ~/plugins/firebase-init.ts

// new version
export default defineNuxtPlugin(nuxtApp => {
  const runtimeConfig = nuxtApp.$config; // Access runtime config
  // console.log('runtimeConfig', runtimeConfig)
  const firebaseConfig = {
    apiKey: runtimeConfig.public.PUBLIC_apiKey,
    authDomain: runtimeConfig.public.PUBLIC_authDomain,
    projectId: runtimeConfig.public.PUBLIC_projectId,
    storageBucket: runtimeConfig.public.PUBLIC_storageBucket,
    messagingSenderId: runtimeConfig.public.PUBLIC_messagingSenderId,
    appId: runtimeConfig.public.PUBLIC_appId,
    measurementId: runtimeConfig.public.PUBLIC_measurementId
  };

  const myFirebase = initializeApp(firebaseConfig as any);
  const db = getFirestore(myFirebase);
  // console.log('db is inited', db)
  // Provide the Firestore instance to the app
  nuxtApp.provide('db', db);
});
