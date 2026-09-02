import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getSession,
  setSession,
  clearSession,
  findUserByEmail,
  addUser,
  getUsers,
  getBookings,
  addBooking as storeAddBooking,
  updateBooking as storeUpdateBooking,
  saveUsers,
} from './storage';
import {
  generateId,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  hasConflict,
  countUserBookingsOnDate,
  MAX_BOOKINGS_PER_DAY,
  MAX_HOURS_PER_BOOKING,
} from './data';

const AppContext = createContext(null);

function ensureAdminExists() {
  const existing = findUserByEmail(ADMIN_EMAIL);
  if (!existing) {
    addUser({
      id: 'admin-001',
      name: 'Dock Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      company: 'Facility Management',
      phone: '',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    ensureAdminExists();
    const session = getSession();
    if (session) setUser(session);
    setBookings(getBookings());
    setReady(true);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const register = useCallback(
    ({ name, email, password, company, phone }) => {
      if (findUserByEmail(email)) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
      if (!name?.trim() || !email?.trim() || !password) {
        return { ok: false, error: 'Please fill in all required fields.' };
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' };
      }
      const newUser = {
        id: generateId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        company: (company || '').trim(),
        phone: (phone || '').trim(),
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      addUser(newUser);
      const session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        company: newUser.company,
        phone: newUser.phone,
        role: newUser.role,
      };
      setSession(session);
      setUser(session);
      showToast('Welcome! Account created successfully.', 'success');
      return { ok: true };
    },
    [showToast]
  );

  const login = useCallback(
    ({ email, password }) => {
      const found = findUserByEmail(email);
      if (!found || found.password !== password) {
        return { ok: false, error: 'Invalid email or password.' };
      }
      const session = {
        id: found.id,
        name: found.name,
        email: found.email,
        company: found.company,
        phone: found.phone,
        role: found.role,
      };
      setSession(session);
      setUser(session);
      showToast(`Welcome back, ${found.name.split(' ')[0]}!`, 'success');
      return { ok: true, role: found.role };
    },
    [showToast]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    showToast('You have been signed out.', 'info');
  }, [showToast]);

  const createBooking = useCallback(
    ({ bayId, date, startHour, duration, vehicleReg, notes }) => {
      if (!user) return { ok: false, error: 'You must be signed in.' };
      if (user.role === 'admin') {
        return { ok: false, error: 'Admins cannot create bookings. Use a user account.' };
      }
      if (!bayId || !date || startHour === '' || startHour === null || !duration) {
        return { ok: false, error: 'Please complete all booking fields.' };
      }
      const dur = Number(duration);
      const start = Number(startHour);
      if (dur < 1 || dur > MAX_HOURS_PER_BOOKING) {
        return { ok: false, error: `Maximum booking length is ${MAX_HOURS_PER_BOOKING} hours.` };
      }
      if (start < 0 || start > 23) {
        return { ok: false, error: 'Invalid start time.' };
      }
      if (start + dur > 24) {
        return {
          ok: false,
          error: 'Booking cannot extend past midnight. Please choose an earlier start or shorter duration.',
        };
      }

      const dayCount = countUserBookingsOnDate(bookings, user.id, date);
      if (dayCount >= MAX_BOOKINGS_PER_DAY) {
        return {
          ok: false,
          error: `You already have ${MAX_BOOKINGS_PER_DAY} bookings on this day. Maximum is ${MAX_BOOKINGS_PER_DAY} per person per day.`,
        };
      }

      if (hasConflict(bookings, Number(bayId), date, start, dur)) {
        return {
          ok: false,
          error: 'This time slot overlaps an existing booking on this bay. Please choose another time.',
        };
      }

      const booking = {
        id: generateId(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userCompany: user.company || '',
        userPhone: user.phone || '',
        bayId: Number(bayId),
        date,
        startHour: start,
        duration: dur,
        vehicleReg: (vehicleReg || '').trim().toUpperCase(),
        notes: (notes || '').trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
      };

      storeAddBooking(booking);
      setBookings(getBookings());
      showToast('Booking submitted — awaiting admin approval.', 'success');
      return { ok: true, booking };
    },
    [user, bookings, showToast]
  );

  const cancelBooking = useCallback(
    (id) => {
      const b = bookings.find((x) => x.id === id);
      if (!b) return { ok: false, error: 'Booking not found.' };
      if (b.userId !== user?.id && user?.role !== 'admin') {
        return { ok: false, error: 'Not authorised.' };
      }
      if (b.status === 'cancelled' || b.status === 'rejected') {
        return { ok: false, error: 'Booking already closed.' };
      }
      storeUpdateBooking(id, { status: 'cancelled', reviewedAt: new Date().toISOString() });
      setBookings(getBookings());
      showToast('Booking cancelled.', 'info');
      return { ok: true };
    },
    [user, bookings, showToast]
  );

  const reviewBooking = useCallback(
    (id, decision) => {
      if (user?.role !== 'admin') return { ok: false, error: 'Admin only.' };
      if (!['approved', 'rejected'].includes(decision)) {
        return { ok: false, error: 'Invalid decision.' };
      }
      const b = bookings.find((x) => x.id === id);
      if (!b) return { ok: false, error: 'Booking not found.' };
      if (b.status !== 'pending') {
        return { ok: false, error: 'Only pending bookings can be reviewed.' };
      }

      // On approve, re-check conflict against other approved bookings
      if (decision === 'approved') {
        const others = bookings.filter((x) => x.id !== id);
        if (hasConflict(others, b.bayId, b.date, b.startHour, b.duration)) {
          return {
            ok: false,
            error: 'Cannot approve — this slot now conflicts with another approved/pending booking.',
          };
        }
      }

      storeUpdateBooking(id, {
        status: decision,
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.id,
      });
      setBookings(getBookings());
      showToast(
        decision === 'approved' ? 'Booking approved.' : 'Booking rejected.',
        decision === 'approved' ? 'success' : 'info'
      );
      return { ok: true };
    },
    [user, bookings, showToast]
  );

  const refreshBookings = useCallback(() => {
    setBookings(getBookings());
  }, []);

  const getAllUsers = useCallback(() => getUsers().map(({ password, ...u }) => u), []);

  const value = {
    user,
    ready,
    bookings,
    toast,
    showToast,
    register,
    login,
    logout,
    createBooking,
    cancelBooking,
    reviewBooking,
    refreshBookings,
    getAllUsers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
