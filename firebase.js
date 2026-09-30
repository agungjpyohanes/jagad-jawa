// Import fungsi yang diperlukan dari SDK Firebase
import { initializeApp } from "firebase/app";

// Konfigurasi Firebase dari proyek Anda
const firebaseConfig = {
  apiKey: "AIzaSyDqXswNdF1bLNThYWXE1TmvuEkZ30lmy0Q",
  authDomain: "jagad-jawa.firebaseapp.com",
  projectId: "jagad-jawa",
  storageBucket: "jagad-jawa.appspot.com",
  messagingSenderId: "523264280126",
  appId: "1:523264280126:web:a4a47585b186d82dbe336f"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

export default app;