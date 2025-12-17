// 🔐 ЛОГИКА ВХОДА И РЕГИСТРАЦИИ

// Проверяем, вошел ли пользователь при загрузке страницы
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Пользователь уже вошел - загружаем его профиль
    console.log("✅ Пользователь вошел:", user.email);
    loadUserProfile(user.uid);
    showLoggedInUI(user.email);
  } else {
    // Пользователь не вошел
    console.log("❌ Пользователь не авторизован");
    showLoginUI();
  }
});

// 📝 РЕГИСТРАЦИЯ
function registerUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("✅ Регистрация успешна!");
      
      // Создаем документ пользователя в базе
      db.collection("users").doc(user.uid).set({
        email: email,
        companyName: "",
        contactName: "",
        phone: "",
        createdAt: new Date()
      });
      
      closeLoginModal();
      showLoggedInUI(email);
    })
    .catch(error => {
      console.error("❌ Ошибка регистрации:", error.message);
      alert("Ошибка: " + error.message);
    });
}

// 🔑 ВХОД
function loginUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("✅ Вход успешен!");
      closeLoginModal();
      showLoggedInUI(email);
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
  db.collection("users").doc(userId).get()
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        document.getElementById('displayCompanyName').textContent = userData.companyName || "Не указано";
        document.getElementById('displayContactName').textContent = userData.contactName || "Не указано";
        document.getElementById('displayEmail').textContent = userData.email;
        document.getElementById('displayPhone').textContent = userData.phone || "Не указано";
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
  const email = document.getElementById('editEmail').value;
  const phone = document.getElementById('editPhone').value;
  
  // Сохраняем в базу данных
  db.collection("users").doc(user.uid).update({
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

// 🎨 ИНТЕРФЕЙС - показываем формы входа
function showLoginUI() {
  // Скрываем профиль
  const profileSection = document.getElementById('profile');
  if (profileSection) profileSection.style.display = 'none';
  
  // Показываем кнопку входа
  const loginBtn = document.querySelector('[onclick="showLoginForm()"]');
  if (loginBtn) loginBtn.style.display = 'inline-block';
}

// 🎨 ИНТЕРФЕЙС - показываем профиль
function showLoggedInUI(email) {
  // Скрываем кнопку входа
  const loginBtn = document.querySelector('[onclick="showLoginForm()"]');
  if (loginBtn) {
    loginBtn.textContent = "Выход (" + email + ")";
    loginBtn.onclick = logoutUser;
  }
  
  // Показываем профиль при открытии раздела
  const navProfile = document.querySelector('[onclick="showSection(\'profile\')"]');
  if (navProfile) navProfile.style.display = 'inline-block';
}

// 📱 МОДАЛЬНОЕ ОКНО ВХОДА
function showLoginForm() {
  const modal = document.getElementById('loginModal');
  if (!modal) createLoginModal();
  document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
}

// Создаем модальное окно для входа/регистрации
function createLoginModal() {
  const html = `
    <div id="loginModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center;">
      <div style="background: white; padding: 40px; border-radius: 12px; max-width: 400px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <h2 style="margin-bottom: 20px; text-align: center;">Вход в кабинет</h2>
        
        <div id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="loginEmail" placeholder="вам@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" id="loginPassword" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-bottom: 20px;">
          </div>
          
          <button onclick="loginUser(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value)" class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">Вход</button>
          <button onclick="document.getElementById('loginForm').style.display='none'; document.getElementById('registerForm').style.display='block';" class="btn btn-secondary" style="width: 100%;">Нет аккаунта? Регистрация</button>
          <button onclick="closeLoginModal()" class="btn btn-secondary" style="width: 100%; margin-top: 10px; background: #ddd;">Закрыть</button>
        </div>
        
        <div id="registerForm" style="display: none;">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="registerEmail" placeholder="вам@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
          </div>
          <div class="form-group">
            <label>Пароль (минимум 6 символов)</label>
            <input type="password" id="registerPassword" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-bottom: 20px;">
          </div>
          
          <button onclick="registerUser(document.getElementById('registerEmail').value, document.getElementById('registerPassword').value)" class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">Создать аккаунт</button>
          <button onclick="document.getElementById('registerForm').style.display='none'; document.getElementById('loginForm').style.display='block';" class="btn btn-secondary" style="width: 100%;">Уже есть аккаунт? Вход</button>
          <button onclick="closeLoginModal()" class="btn btn-secondary" style="width: 100%; margin-top: 10px; background: #ddd;">Закрыть</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

// Создаем модальное окно при загрузке страницы
window.addEventListener('load', () => {
  if (!document.getElementById('loginModal')) {
    createLoginModal();
  }
});