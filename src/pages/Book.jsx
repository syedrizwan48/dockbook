import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { PageHeader, Card, Button, Input, Select, Textarea, Alert } from '../components/ui';
import BayCard from '../components/BayCard';
import {
  BAYS,
  getTimeOptions,
  getDurationOptions,
  MAX_HOURS_PER_BOOKING,
  MAX_BOOKINGS_PER_DAY,
  todayISO,
  formatTimeRange,
  hasConflict,
  countUserBookingsOnDate,
} from '../data';
import { CalendarPlus, AlertTriangle } from 'lucide-react';

export default function Book() {
  const { user, bookings, createBooking } = useApp();
  const navigate = useNavigate();
  const [bayId, setBayId] = useState(1);
  const [date, setDate] = useState(todayISO());
  const [startHour, setStartHour] = useState(8);
  const [duration, setDuration] = useState(2);
  const [vehicleReg, setVehicleReg] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timeOpts = getTimeOptions();
  const durOpts = getDurationOptions();

  const dayCount = countUserBookingsOnDate(bookings, user.id, date);
  const atLimit = dayCount >= MAX_BOOKINGS_PER_DAY;

  const conflict = useMemo(() => {
    if (startHour === '' || !duration || !date) return false;
    return hasConflict(bookings, Number(bayId), date, Number(startHour), Number(duration));
  }, [bookings, bayId, date, startHour, duration]);

  const pastMidnight = Number(startHour) + Number(duration) > 24;

  const availableEndHours = useMemo(() => {
    // Filter durations that would go past midnight
    return durOpts.filter((d) => Number(startHour) + d.value <= 24);
  }, [startHour, durOpts]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = createBooking({
      bayId,
      date,
      startHour,
      duration,
      vehicleReg,
      notes,
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/my-bookings');
  };

  return (
    <div>
      <PageHeader
        title="New booking"
        subtitle={`Select a bay and time. Max ${MAX_HOURS_PER_BOOKING} hours per booking · max ${MAX_BOOKINGS_PER_DAY} bookings per day.`}
      />

      <form onSubmit={onSubmit}>
        {/* Step 1 — Bay */}
        <section style={{ marginBottom: 28 }}>
          <StepLabel n={1} label="Choose a loading bay" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            {BAYS.map((bay) => (
              <BayCard
                key={bay.id}
                bayId={bay.id}
                selected={bayId === bay.id}
                onSelect={setBayId}
              />
            ))}
          </div>
        </section>

        {/* Step 2 — Time */}
        <section style={{ marginBottom: 28 }}>
          <StepLabel n={2} label="Date & time" />
          <Card>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
              }}
            >
              <Input
                label="Date"
                type="date"
                name="date"
                required
                min={todayISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Select
                label="Start time"
                name="startHour"
                required
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
              >
                {timeOpts.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
              <Select
                label={`Duration (max ${MAX_HOURS_PER_BOOKING}h)`}
                name="duration"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {availableEndHours.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Live summary */}
            <div
              style={{
                marginTop: 8,
                padding: '14px 16px',
                background: '#0A0A0A',
                borderRadius: 10,
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 14 }}>
                <span style={{ color: '#F5E642', fontWeight: 800 }}>
                  {BAYS.find((b) => b.id === bayId)?.name}
                </span>
                {' · '}
                {date} · {formatTimeRange(Number(startHour), Number(duration))}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#F5E642',
                  color: '#0A0A0A',
                  padding: '4px 10px',
                  borderRadius: 6,
                }}
              >
                {duration}h slot
              </div>
            </div>

            {atLimit && (
              <div style={{ marginTop: 14 }}>
                <Alert type="error">
                  <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  You already have {MAX_BOOKINGS_PER_DAY} bookings on this day. Choose another date
                  or cancel an existing booking.
                </Alert>
              </div>
            )}
            {conflict && !atLimit && (
              <div style={{ marginTop: 14 }}>
                <Alert type="warning">
                  This time overlaps an existing booking on this bay. Please pick another slot.
                </Alert>
              </div>
            )}
            {pastMidnight && (
              <div style={{ marginTop: 14 }}>
                <Alert type="error">Bookings cannot extend past midnight.</Alert>
              </div>
            )}
            {!atLimit && !conflict && (
              <p style={{ marginTop: 12, fontSize: 13, color: '#737373' }}>
                Bookings used on this date: {dayCount}/{MAX_BOOKINGS_PER_DAY}
              </p>
            )}
          </Card>
        </section>

        {/* Step 3 — Details */}
        <section style={{ marginBottom: 28 }}>
          <StepLabel n={3} label="Vehicle & notes" />
          <Card>
            <Input
              label="Vehicle registration"
              name="vehicleReg"
              placeholder="e.g. ABC-123"
              value={vehicleReg}
              onChange={(e) => setVehicleReg(e.target.value)}
            />
            <Textarea
              label="Notes (optional)"
              name="notes"
              placeholder="Delivery type, special requirements…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Card>
        </section>

        {error && <Alert type="error">{error}</Alert>}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="submit"
            size="lg"
            icon={CalendarPlus}
            disabled={loading || atLimit || conflict || pastMidnight}
          >
            {loading ? 'Submitting…' : 'Submit booking request'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: '#737373' }}>
          Your request will be <strong>pending</strong> until an admin approves or rejects it.
        </p>
      </form>
    </div>
  );
}

function StepLabel({ n, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#F5E642',
          border: '2px solid #0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        {n}
      </div>
      <h2 style={{ fontSize: 17, fontWeight: 800 }}>{label}</h2>
    </div>
  );
}
