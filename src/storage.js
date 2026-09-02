// localStorage persistence layer

const USERS_KEY = 'dock_users';
const BOOKINGS_KEY = 'dock_bookings';
const SESSION_KEY = 'dock_session';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Users ──────────────────────────────────────────
export function getUsers() {
  return read(USERS_KEY, []);
}

export function saveUsers(users) {
  write(USERS_KEY, users);
}

export function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

// ── Bookings ───────────────────────────────────────
export function getBookings() {
  return read(BOOKINGS_KEY, []);
}

export function saveBookings(bookings) {
  write(BOOKINGS_KEY, bookings);
}

export function addBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
  return booking;
}

export function updateBooking(id, patch) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...patch };
  saveBookings(bookings);
  return bookings[idx];
}

// ── Session ────────────────────────────────────────
export function getSession() {
  return read(SESSION_KEY, null);
}

export function setSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  // Store minimal session (no password)
  write(SESSION_KEY, {
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    role: user.role,
  });
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
