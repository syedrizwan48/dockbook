import { useMemo, useState } from 'react';
import { useApp } from '../context';
import { PageHeader, Card, EmptyState } from '../components/ui';
import StatusBadge from '../components/StatusBadge';
import {
  BAYS,
  todayISO,
  formatTime,
  formatTimeRange,
} from '../data';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function AdminSchedule() {
  const { bookings } = useApp();
  const [date, setDate] = useState(todayISO());

  const dayBookings = useMemo(() => {
    return bookings
      .filter(
        (b) =>
          b.date === date &&
          (b.status === 'pending' || b.status === 'approved')
      )
      .sort((a, b) => a.startHour - b.startHour || a.bayId - b.bayId);
  }, [bookings, date]);

  // Build a simple hour grid 0-23 for each bay
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const cellBooking = (bayId, hour) => {
    return dayBookings.find(
      (b) =>
        b.bayId === bayId &&
        hour >= b.startHour &&
        hour < b.startHour + b.duration
    );
  };

  const isStart = (bayId, hour) => {
    const b = dayBookings.find((x) => x.bayId === bayId && x.startHour === hour);
    return b || null;
  };

  return (
    <div>
      <PageHeader
        title="Bay schedule"
        subtitle="Day view of all pending and approved bookings across the 3 loading bays."
        action={
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '2px solid #0A0A0A',
              fontSize: 14,
              fontWeight: 600,
              background: '#F5E642',
              color: '#0A0A0A',
              cursor: 'pointer',
            }}
          />
        }
      />

      <div
        style={{
          marginBottom: 20,
          fontSize: 15,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Calendar size={18} />
        {format(parseISO(date), 'EEEE, d MMMM yyyy')}
        <span
          style={{
            marginLeft: 8,
            fontSize: 12,
            background: '#0A0A0A',
            color: '#F5E642',
            padding: '3px 10px',
            borderRadius: 999,
            fontWeight: 800,
          }}
        >
          {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Visual grid */}
      <Card padding={0} style={{ overflow: 'auto', marginBottom: 28 }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 640,
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ background: '#0A0A0A', color: '#FFFFFF' }}>
              <th
                style={{
                  padding: '14px 12px',
                  textAlign: 'left',
                  fontWeight: 700,
                  width: 80,
                  position: 'sticky',
                  left: 0,
                  background: '#0A0A0A',
                  zIndex: 2,
                }}
              >
                Time
              </th>
              {BAYS.map((bay) => (
                <th
                  key={bay.id}
                  style={{
                    padding: '14px 12px',
                    textAlign: 'left',
                    fontWeight: 700,
                    borderLeft: '1px solid #2A2A2A',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={bay.image}
                      alt=""
                      style={{
                        width: 40,
                        height: 28,
                        objectFit: 'cover',
                        borderRadius: 6,
                        border: '2px solid #F5E642',
                      }}
                    />
                    <span>
                      {bay.name}
                      <div style={{ fontSize: 11, color: '#F5E642', fontWeight: 600 }}>
                        24/7
                      </div>
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} style={{ borderTop: '1px solid #E5E5E5' }}>
                <td
                  style={{
                    padding: '6px 12px',
                    fontWeight: 700,
                    color: '#737373',
                    background: hour % 2 === 0 ? '#FAFAFA' : '#FFFFFF',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    borderRight: '1px solid #E5E5E5',
                  }}
                >
                  {formatTime(hour)}
                </td>
                {BAYS.map((bay) => {
                  const startB = isStart(bay.id, hour);
                  const occupied = cellBooking(bay.id, hour);
                  // Only render content on start cell; span visually via background on all occupied
                  return (
                    <td
                      key={bay.id}
                      style={{
                        padding: startB ? '4px 6px' : '6px',
                        borderLeft: '1px solid #E5E5E5',
                        background: occupied
                          ? occupied.status === 'approved'
                            ? '#DCFCE7'
                            : '#FEF3C7'
                          : hour % 2 === 0
                            ? '#FAFAFA'
                            : '#FFFFFF',
                        verticalAlign: 'top',
                        height: 36,
                      }}
                    >
                      {startB && (
                        <div
                          style={{
                            background:
                              startB.status === 'approved' ? '#16A34A' : '#F59E0B',
                            color: '#FFFFFF',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                          title={`${startB.userName} · ${formatTimeRange(startB.startHour, startB.duration)}`}
                        >
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                            {startB.userName}
                          </div>
                          <div style={{ opacity: 0.9, fontWeight: 600 }}>
                            {formatTimeRange(startB.startHour, startB.duration)}
                            {startB.vehicleReg ? ` · ${startB.vehicleReg}` : ''}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* List detail */}
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>
        Bookings on this day
      </h2>
      {dayBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings"
          description="Nothing pending or approved for this date."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dayBookings.map((b) => {
            const bay = BAYS.find((x) => x.id === b.bayId);
            return (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: '#FFFFFF',
                  border: '2px solid #E5E5E5',
                  borderRadius: 12,
                  flexWrap: 'wrap',
                }}
              >
                <img
                  src={bay?.image}
                  alt=""
                  style={{
                    width: 56,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '2px solid #F5E642',
                  }}
                />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 800 }}>{bay?.name}</div>
                  <div style={{ fontSize: 13, color: '#525252' }}>
                    {formatTimeRange(b.startHour, b.duration)} · {b.userName}
                    {b.userCompany ? ` (${b.userCompany})` : ''}
                    {b.vehicleReg ? ` · ${b.vehicleReg}` : ''}
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
