import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context';
import { PageHeader, Button, EmptyState } from '../components/ui';
import BookingCard from '../components/BookingCard';
import { CalendarPlus, X } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function MyBookings() {
  const { user, bookings, cancelBooking } = useApp();
  const [filter, setFilter] = useState('all');

  const mine = useMemo(() => {
    let list = bookings.filter((b) => b.userId === user.id);
    if (filter !== 'all') list = list.filter((b) => b.status === filter);
    return list.sort(
      (a, b) => b.date.localeCompare(a.date) || b.startHour - a.startHour || b.createdAt.localeCompare(a.createdAt)
    );
  }, [bookings, user.id, filter]);

  const handleCancel = (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    cancelBooking(id);
  };

  return (
    <div>
      <PageHeader
        title="My bookings"
        subtitle="Track status of your loading bay requests."
        action={
          <Link to="/book">
            <Button icon={CalendarPlus}>New booking</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                border: active ? '2px solid #0A0A0A' : '2px solid #E5E5E5',
                background: active ? '#F5E642' : '#FFFFFF',
                color: '#0A0A0A',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title={filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          description="Submit a booking request and an admin will approve or reject it."
          action={
            <Link to="/book">
              <Button icon={CalendarPlus}>Book a bay</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mine.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              actions={
                (b.status === 'pending' || b.status === 'approved') && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel booking
                  </Button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
