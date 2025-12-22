// ⚠️ ВСТАВЬ СЮДА КОНФИГ ИЗ FIREBASE
// Скопируй весь код из Firebase консоли и замени на него

const firebaseConfig = {
  apiKey: "AIzaSyBPbMSsPLiuvg61MGufdRQTHwh40_uiN7U",
  authDomain: "cobmsp.firebaseapp.com",
  projectId: "cobmsp",
  storageBucket: "cobmsp.firebasestorage.app",
  messagingSenderId: "150978831496",
  appId: "1:150978831496:web:12915ac2d2ead44e69eb3d",
  measurementId: "G-8YRM9F6LBD"
};

// Инициализируем Firebase
firebase.initializeApp(firebaseConfig);

// Получаем ссылки на нужные сервисы
const auth = firebase.auth();
const db = firebase.firestore();

console.log("✅ Firebase подключён!");
