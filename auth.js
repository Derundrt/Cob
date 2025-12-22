/ 🔐 ЛОГИКА ВХОДА И РЕГИСТРАЦИИ

// Проверяем, вошел ли пользователь при загрузке страницы
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("✅ Пользователь вошел:", user.email);
    loadUserProfile(user.uid);
    showLoggedInUI(user.email);
  } else {
    console.log("❌ Пользователь не авторизован");
    showLoginUI();
  }
});

// 📝 РЕГИСТРАЦИЯ
function registerUser(email, password) {
  console.log("Попытка регистрации:", email);
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("✅ Регистрация успешна!");
      
      // Создаем документ пользователя в базе
      firebase.firestore().collection("users").doc(user.uid).set({
        email: email,
        companyName: "",
        contactName: "",
        phone: "",
        createdAt: new Date()
      });
      
      closeLoginModal();
      showLoggedInUI(email);
      alert("✅ Аккаунт создан!");
    })
    .catch(error => {
      console.error("❌ Ошибка регистрации:", error.message);
      alert("Ошибка: " + error.message);
    });
}

// 🔑 ВХОД
function loginUser(email, password) {
  console.log("Попытка входа:", email);
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("✅ Вход успешен!");
      closeLoginModal();
      showLoggedInUI(email);
      alert("✅ Вы вошли в систему!");
    })
    .catch(error => {
      console.error("❌ Ошибка входа:", error.message);
      alert("Ошибка: " + error.message);
    });
}

// 🚪 ВЫХОД
function logoutUser() {
  firebase.auth().signOut()
    .then(() => {
      console.log("✅ Выход выполнен");
      showLoginUI();
      alert("Вы вышли из системы");
    })
    .catch(error => console.error("❌ Ошибка выхода:", error));
}

// 💾 ЗАГРУЖАЕМ ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
function loadUserProfile(userId) {
  firebase.firestore().collection("users").doc(userId).get()
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        console.log("✅ Профиль загружен:", userData);
        document.getElementById('displayCompanyName').textContent = userData.companyName || "—";
        document.getElementById('displayContactName').textContent = userData.contactName || "—";
        document.getElementById('displayEmail').textContent = userData.email;
        document.getElementById('displayPhone').textContent = userData.phone || "—";
      }
    })
    .catch(error => console.error("❌ Ошибка загрузки профиля:", error));
}

// 💾 СОХРАНЯЕМ ИЗМЕНЕНИЯ ПРОФИЛЯ
function saveProfileToFirebase(event) {
  event.preventDefault();
  
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Вы не авторизованы!");
    return;
  }
  
  const companyName = document.getElementById('editCompanyName').value;
  const contactName = document.getElementById('editContactName').value;
  const phone = document.getElementById('editPhone').value;
  
  console.log("Сохраняю профиль:", { companyName, contactName, phone });
  
  // Сохраняем в базу данных
  firebase.firestore().collection("users").doc(user.uid).update({
    companyName: companyName,
    contactName: contactName,
    phone: phone,
    updatedAt: new Date()
  })
  .then(() => {
    console.log("✅ Профиль сохранен!");
    alert("✓ Профиль успешно сохранён!");
    loadUserProfile(user.uid);
    toggleEditMode();
  })
  .catch(error => {
    console.error("❌ Ошибка сохранения:", error);
    alert("Ошибка: " + error.message);
  });
}

// 🎨 ИНТЕРФЕЙС - показываем кнопку входа
function showLoginUI() {
  const loginBtn = document.querySelector('[onclick="showLoginForm()"]');
  if (loginBtn) {
    loginBtn.textContent = "Вход";
    loginBtn.onclick = showLoginForm;
  }
}

// 🎨 ИНТЕРФЕЙС - показываем профиль и кнопку выхода
function showLoggedInUI(email) {
  const loginBtn = document.querySelector('[onclick="showLoginForm()"]');
  if (loginBtn) {
    loginBtn.textContent = "Выход";
    loginBtn.onclick = logoutUser;
  }
}

// 📱 МОДАЛЬНОЕ ОКНО ВХОДА
function showLoginForm() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Создаем модальное окно для входа/регистрации
function createLoginModal() {
  const html = `
    <div id="loginModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; flex-wrap: wrap;">
      <div style="background: white; padding: 40px; border-radius: 12px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <h2 style="margin-bottom: 20px; text-align: center;" id="modalTitle">Вход в кабинет</h2>
        
        <div id="loginForm">
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
            <label style="font-size: 14px; font-weight: 500;">Email</label>
            <input type="email" id="loginEmail" placeholder="вам@email.com" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            <label style="font-size: 14px; font-weight: 500;">Пароль</label>
            <input type="password" id="loginPassword" placeholder="••••••••" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
          </div>
          
          <button type="button" onclick="loginUser(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value)" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background-color: #218080d; color: #000; width: 100%; margin-bottom: 10px;">Вход</button>
          <button type="button" onclick="showRegisterForm()" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background-color: rgba(174, 82, 64, 0.12); color: #134252; width: 100%; margin-bottom: 10px;">Нет аккаунта? Регистрация</button>
          <button type="button" onclick="closeLoginModal()" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background-color: #ddd; color: #134252; width: 100%;">Закрыть</button>
        </div>
        
        <div id="registerForm" style="display: none;">
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
            <label style="font-size: 14px; font-weight: 500;">Email</label>
            <input type="email" id="registerEmail" placeholder="вам@email.com" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            <label style="font-size: 14px; font-weight: 500;">Пароль (минимум 6 символов)</label>
            <input type="password" id="registerPassword" placeholder="••••••••" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
          </div>
          
          <button type="button" onclick="registerUser(document.getElementById('registerEmail').value, document.getElementById('registerPassword').value)" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background-color: #218080d; color: #000; width: 100%; margin-bottom: 10px;">Создать аккаунт</button>
          <button type="button" onclick="showLoginFormView()" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background-color: rgba(174, 82, 64, 0.12); color: #134252; width: 100%; margin-bottom: 10px;">Уже есть аккаунт? Вход</button>
          <button type="button" onclick="closeLoginModal()" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background-color: #ddd; color: #134252; width: 100%;">Закрыть</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('modalTitle').textContent = 'Создать аккаунт';
}

function showLoginFormView() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('modalTitle').textContent = 'Вход в кабинет';
}

// Создаем модальное окно при загрузке страницы
window.addEventListener('load', () => {
  if (!document.getElementById('loginModal')) {
    createLoginModal();
  }
});
