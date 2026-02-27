import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCeMfnhLyBX2VQQatLS28L6gpwGKOXmEDk',
  authDomain: 'eladtrip.firebaseapp.com',
  projectId: 'eladtrip',
  storageBucket: 'eladtrip.firebasestorage.app',
  messagingSenderId: '884136866305',
  appId: '1:884136866305:web:6b80a1b4f5e920534a8600',
  measurementId: 'G-YKEWVNCMQ8',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
