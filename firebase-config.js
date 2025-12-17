// ⚠️ ВСТАВЬ СЮДА КОНФИГ ИЗ FIREBASE
// Скопируй весь код из Firebase консоли и замени на него

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyReplace123456789",
  authDomain: "logcoop-demo.firebaseapp.com",
  projectId: "logcoop-demo",
  storageBucket: "logcoop-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Инициализируем Firebase
firebase.initializeApp(firebaseConfig);

// Получаем ссылки на нужные сервисы
const auth = firebase.auth();
const db = firebase.firestore();

console.log("✅ Firebase подключён!");