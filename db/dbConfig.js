import { initializeApp } from 'firebase/app';

// firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyBH9SlxYY-St8BDhoUQ3qRQP0vuIVDVdRs",
  authDomain: "android-1dfec.firebaseapp.com",
  databaseURL: "https://android-1dfec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "android-1dfec",
  storageBucket: "android-1dfec.appspot.com",
  messagingSenderId: "643679131414",
  appId: "1:643679131414:web:730f198619e9b507c92237"
};

const app = initializeApp(firebaseConfig);

export default app