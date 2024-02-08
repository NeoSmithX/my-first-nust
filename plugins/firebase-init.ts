// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// const adminWhitelistAddress = JSON.parse(useRuntimeConfig().public.PUBLIC_adminList);
const firebaseConfig = {
  apiKey: useRuntimeConfig().public.PUBLIC_apiKey,
  authDomain: useRuntimeConfig().public.PUBLIC_authDomain,
  projectId: useRuntimeConfig().public.PUBLIC_projectId,
  storageBucket: useRuntimeConfig().public.PUBLIC_storageBucket,
  messagingSenderId: useRuntimeConfig().public.PUBLIC_messagingSenderId,
  appId: useRuntimeConfig().public.PUBLIC_appId,
  measurementId: useRuntimeConfig().public.PUBLIC_measurementId
};
 
const myFirebase = initializeApp(firebaseConfig as any);
export const db = getFirestore(myFirebase);
