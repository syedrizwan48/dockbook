import { Link } from 'react-router-dom';
import { useApp } from '../context';
import { PageHeader, StatCard, Button, EmptyState, Alert } from '../components/ui';
import BayCard from '../components/BayCard';
import BookingCard from '../components/BookingCard';
import {
  BAYS,
  MAX_HOURS_PER_BOOKING,
  MAX_BOOKINGS_PER_DAY,
  todayISO,
  countUserBookingsOnDate,
} from '../data';
import {
  CalendarPlus,
  ClipboardList,
  Clock,
  CheckCircle2,
  Hourglass,
  Truck,
} from 'lucide-react';
import { isAfter, parseISO, startOfDay } from 'date-fns';

export default function Dashboard() {
  const { user, bookings } = useApp();
  const mine = bookings.filter((b) => b.userId === user.id);
  const upcoming = mine
    .filter(
      (b) =>
        (b.status === 'pending' || b.status === 'approved') &&
        !isAfter(startOfDay(new Date()), parseISO(b.date))
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);

  const pending = mine.filter((b) => b.status === 'pending').length;
  const approved = mine.filter((b) => b.status === 'approved').length;
  const todayCount = countUserBookingsOnDate(bookings, user.id, todayISO());

  return (
    <div>
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}`}
        subtitle="Manage your loading bay bookings. All 3 bays are open 24/7."
        action={
          <Link to="/book">
            <Button icon={CalendarPlus} size="lg">
              New booking
            </Button>
          </Link>
        }
      />

      {/* Rules banner */}
      <Alert type="info">
        <strong>Booking rules:</strong> max {MAX_HOURS_PER_BOOKING} hours per booking · max{' '}
        {MAX_BOOKINGS_PER_DAY} bookings per person per day · all requests need admin approval · bays
        accessible 24/7
        {todayCount > 0 && (
          <>
            {' '}
            · <strong>Today:</strong> {todayCount}/{MAX_BOOKINGS_PER_DAY} used
          </>
        )}
      </Alert>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard label="Upcoming" value={upcoming.length} icon={Truck} accent />
        <StatCard label="Pending approval" value={pending} icon={Hourglass} />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} />
        <StatCard label="Today's slots used" value={`${todayCount}/${MAX_BOOKINGS_PER_DAY}`} icon={Clock} />
      </div>

      {/* Bays overview */}
      <section style={{ marginBottom: 36 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Loading bays</h2>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              background: '#0A0A0A',
              color: '#F5E642',
              padding: '4px 10px',
              borderRadius: 999,
            }}
          >
            24/7 ACCESS
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {BAYS.map((bay) => (
            <BayCard key={bay.id} bayId={bay.id} compact />
          ))}
        </div>
      </section>

      {/* Upcoming bookings */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Your upcoming bookings</h2>
          <Link to="/my-bookings">
            <Button variant="outline" size="sm" icon={ClipboardList}>
              View all
            </Button>
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarPlus}
            title="No upcoming bookings"
            description="Book a loading bay for up to 4 hours. You can make up to 2 bookings per day."
            action={
              <Link to="/book">
                <Button icon={CalendarPlus}>Book a bay</Button>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {upcoming.slice(0, 3).map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
