// Shared constants & helpers for the Loading Dock app

export const BAYS = [
  {
    id: 1,
    name: 'Loading Bay 1',
    image: '/bay1.jpg',
    description: 'Main entrance bay — closest to reception',
  },
  {
    id: 2,
    name: 'Loading Bay 2',
    image: '/bay2.jpg',
    description: 'Central bay — ideal for medium loads',
  },
  {
    id: 3,
    name: 'Loading Bay 3',
    image: '/bay3.jpg',
    description: 'Rear bay — best for oversized vehicles',
  },
];

export const MAX_HOURS_PER_BOOKING = 4;
export const MAX_BOOKINGS_PER_DAY = 2;
export const ACCESS_NOTE = 'All 3 loading bays are accessible 24/7';

// Demo admin account
export const ADMIN_EMAIL = 'admin@dock.com';
export const ADMIN_PASSWORD = 'admin123';

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** Build hourly slots 00:00 – 23:00 */
export function getTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    const label = `${String(h).padStart(2, '0')}:00`;
    opts.push({ value: h, label });
  }
  return opts;
}

/** Duration options 1–4 hours */
export function getDurationOptions() {
  return [1, 2, 3, 4].map((h) => ({
    value: h,
    label: h === 1 ? '1 hour' : `${h} hours`,
  }));
}

export function formatTime(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function formatTimeRange(startHour, duration) {
  const end = (startHour + duration) % 24;
  const crosses = startHour + duration > 23;
  if (crosses && end !== 0) {
    // still within same calendar day representation for simplicity
  }
  const endHour = startHour + duration;
  if (endHour > 24) {
    return `${formatTime(startHour)} – ${formatTime(endHour - 24)} (+1 day)`;
  }
  if (endHour === 24) {
    return `${formatTime(startHour)} – 24:00`;
  }
  return `${formatTime(startHour)} – ${formatTime(endHour)}`;
}

export function statusLabel(status) {
  const map = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
}

/** Check if two time ranges on same bay/date overlap */
export function rangesOverlap(aStart, aDur, bStart, bDur) {
  const aEnd = aStart + aDur;
  const bEnd = bStart + bDur;
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Does a proposed booking conflict with existing approved/pending bookings?
 * Rejected & cancelled are ignored.
 */
export function hasConflict(bookings, bayId, date, startHour, duration, excludeId = null) {
  return bookings.some((b) => {
    if (excludeId && b.id === excludeId) return false;
    if (b.bayId !== bayId) return false;
    if (b.date !== date) return false;
    if (b.status === 'rejected' || b.status === 'cancelled') return false;
    return rangesOverlap(startHour, duration, b.startHour, b.duration);
  });
}

/** Count a user's bookings for a given date (pending + approved only) */
export function countUserBookingsOnDate(bookings, userId, date) {
  return bookings.filter(
    (b) =>
      b.userId === userId &&
      b.date === date &&
      (b.status === 'pending' || b.status === 'approved')
  ).length;
}
