import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMimVAJBkCS24IEGhT0JExJpa4tSQC2yI",
  authDomain: "bookapp-36bb8.firebaseapp.com",
  databaseURL: "https://bookapp-36bb8-default-rtdb.firebaseio.com",
  projectId: "bookapp-36bb8",
  storageBucket: "bookapp-36bb8.firebasestorage.app",
  messagingSenderId: "990223843097",
  appId: "1:990223843097:web:15f75cf178d5a1652ccf88",
  measurementId: "G-6TQCERZKT1",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);