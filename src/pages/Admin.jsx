import { useMemo, useState } from 'react';
import { useApp } from '../context';
import { PageHeader, StatCard, Button, EmptyState, Alert } from '../components/ui';
import BookingCard from '../components/BookingCard';
import {
  ShieldCheck,
  Check,
  X,
  Hourglass,
  CheckCircle2,
  XCircle,
  ClipboardList,
} from 'lucide-react';

export default function Admin() {
  const { bookings, reviewBooking } = useApp();
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState('');

  const counts = useMemo(() => {
    return {
      pending: bookings.filter((b) => b.status === 'pending').length,
      approved: bookings.filter((b) => b.status === 'approved').length,
      rejected: bookings.filter((b) => b.status === 'rejected').length,
      total: bookings.length,
    };
  }, [bookings]);

  const list = useMemo(() => {
    let items = [...bookings];
    if (filter !== 'all') items = items.filter((b) => b.status === filter);
    return items.sort((a, b) => {
      // pending first by createdAt, then by date
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [bookings, filter]);

  const handleReview = (id, decision) => {
    setError('');
    const label = decision === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${label} this booking?`)) return;
    const res = reviewBooking(id, decision);
    if (!res.ok) setError(res.error);
  };

  const filters = [
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
    { id: 'all', label: 'All', count: counts.total },
  ];

  return (
    <div>
      <PageHeader
        title="Admin approvals"
        subtitle="Review and approve or reject loading bay booking requests."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard label="Awaiting review" value={counts.pending} icon={Hourglass} accent />
        <StatCard label="Approved" value={counts.approved} icon={CheckCircle2} />
        <StatCard label="Rejected" value={counts.rejected} icon={XCircle} />
        <StatCard label="Total bookings" value={counts.total} icon={ClipboardList} />
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {filters.map((f) => {
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {f.label}
              <span
                style={{
                  background: active ? '#0A0A0A' : '#E5E5E5',
                  color: active ? '#F5E642' : '#525252',
                  borderRadius: 999,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={filter === 'pending' ? 'All caught up!' : 'No bookings here'}
          description={
            filter === 'pending'
              ? 'There are no booking requests waiting for approval.'
              : 'Nothing matches this filter.'
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              showUser
              actions={
                b.status === 'pending' ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      icon={Check}
                      onClick={() => handleReview(b.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={X}
                      onClick={() => handleReview(b.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
