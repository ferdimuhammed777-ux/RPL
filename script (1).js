const bookingForm = document.getElementById('bookingForm');
const estimatedFare = document.getElementById('estimatedFare');
const vehicleTypeInput = document.getElementById('vehicleType');
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authForm = document.getElementById('authForm');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authTabs = document.querySelectorAll('.tab-button');
const ctaBook = document.getElementById('ctaBook');
const mainNav = document.getElementById('mainNav');
const mobileToggle = document.getElementById('mobileToggle');
const contactForm = document.getElementById('contactForm');

const fareRanges = {
  economy: 'Rp 35.000 - Rp 65.000',
  van: 'Rp 120.000 - Rp 180.000',
  taxi: 'Rp 45.000 - Rp 85.000',
  ojek: 'Rp 18.000 - Rp 35.000',
};

function updateFare() {
  const value = vehicleTypeInput.value;
  estimatedFare.textContent = fareRanges[value] || fareRanges.economy;
}

vehicleTypeInput.addEventListener('change', updateFare);
updateFare();

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const booking = {
    pickup: data.get('pickup'),
    dropoff: data.get('dropoff'),
    vehicleType: data.get('vehicleType'),
    schedule: data.get('schedule') || 'Segera',
    notes: data.get('notes'),
    estimatedFare: estimatedFare.textContent,
  };
  localStorage.setItem('latestBooking', JSON.stringify(booking));
  alert(`Pemesanan berhasil dibuat!\nJenis kendaraan: ${booking.vehicleType}\nEstimasi harga: ${booking.estimatedFare}`);
  bookingForm.reset();
  updateFare();
});

function closeModal() {
  authModal.classList.remove('active');
  authModal.setAttribute('aria-hidden', 'true');
}

function openModal() {
  authModal.classList.add('active');
  authModal.setAttribute('aria-hidden', 'false');
}

openAuthBtn.addEventListener('click', openModal);
closeAuthBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  if (event.target === authModal) closeModal();
});

ctaBook.addEventListener('click', () => {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
});

mobileToggle.addEventListener('click', () => {
  mainNav.classList.toggle('active');
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    authTabs.forEach((btn) => btn.classList.remove('active'));
    tab.classList.add('active');
    const isLogin = tab.dataset.tab === 'login';
    authSubmitBtn.textContent = isLogin ? 'Masuk' : 'Daftar';
  });
});

const usersKey = 'transportasiOnlineUsers';
const authStateKey = 'transportasiOnlineAuth';

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey) || '[]');
}

function setUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function setAuth(email) {
  localStorage.setItem(authStateKey, JSON.stringify({ email, time: Date.now() }));
}

function getAuth() {
  return JSON.parse(localStorage.getItem(authStateKey) || 'null');
}

function showAuthState() {
  const auth = getAuth();
  if (auth) {
    openAuthBtn.textContent = 'Akun: ' + auth.email;
    openAuthBtn.disabled = true;
  }
}

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();
  const activeTab = document.querySelector('.tab-button.active').dataset.tab;
  const users = getUsers();

  if (activeTab === 'login') {
    const account = users.find((user) => user.email === email && user.password === password);
    if (account) {
      setAuth(email);
      alert('Login berhasil!');
      closeModal();
      showAuthState();
    } else {
      alert('Email atau password salah. Coba lagi.');
    }
  } else {
    const registered = users.some((user) => user.email === email);
    if (registered) {
      alert('Email sudah terdaftar. Silakan login.');
      return;
    }
    users.push({ email, password });
    setUsers(users);
    setAuth(email);
    alert('Pendaftaran berhasil! Anda sekarang masuk.');
    closeModal();
    showAuthState();
  }
  authForm.reset();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Pesan Anda telah terkirim. Tim kami akan menghubungi Anda segera.');
  contactForm.reset();
});

showAuthState();
