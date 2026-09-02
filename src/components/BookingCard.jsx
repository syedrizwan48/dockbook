import { BAYS, formatTimeRange } from '../data';
import StatusBadge from './StatusBadge';
import { Calendar, Clock, Truck, Building2, Phone, Mail, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BookingCard({
  booking,
  showUser = false,
  actions = null,
}) {
  const bay = BAYS.find((b) => b.id === booking.bayId);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: '2px solid #E5E5E5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
        {/* Bay thumbnail */}
        <div
          style={{
            width: 140,
            minHeight: 120,
            flexShrink: 0,
            position: 'relative',
            background: '#0A0A0A',
          }}
          className="booking-thumb"
        >
          <img
            src={bay?.image}
            alt={bay?.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 120 }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: '#F5E642',
              color: '#0A0A0A',
              fontWeight: 800,
              fontSize: 11,
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            BAY {booking.bayId}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, padding: '16px 18px', minWidth: 200 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0A0A0A' }}>
                {bay?.name || `Bay ${booking.bayId}`}
              </div>
              {showUser && (
                <div style={{ fontSize: 13, color: '#525252', marginTop: 2 }}>
                  {booking.userName}
                  {booking.userCompany ? ` · ${booking.userCompany}` : ''}
                </div>
              )}
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '10px 16px',
              fontSize: 13,
            }}
          >
            <InfoRow icon={Calendar} label="Date">
              {format(parseISO(booking.date), 'EEE, d MMM yyyy')}
            </InfoRow>
            <InfoRow icon={Clock} label="Time">
              {formatTimeRange(booking.startHour, booking.duration)}
              <span style={{ color: '#737373' }}> ({booking.duration}h)</span>
            </InfoRow>
            {booking.vehicleReg && (
              <InfoRow icon={Truck} label="Vehicle">
                {booking.vehicleReg}
              </InfoRow>
            )}
            {showUser && booking.userEmail && (
              <InfoRow icon={Mail} label="Email">
                {booking.userEmail}
              </InfoRow>
            )}
            {showUser && booking.userPhone && (
              <InfoRow icon={Phone} label="Phone">
                {booking.userPhone}
              </InfoRow>
            )}
            {showUser && booking.userCompany && (
              <InfoRow icon={Building2} label="Company">
                {booking.userCompany}
              </InfoRow>
            )}
            {booking.notes && (
              <InfoRow icon={FileText} label="Notes">
                {booking.notes}
              </InfoRow>
            )}
          </div>
        </div>
      </div>

      {actions && (
        <div
          style={{
            borderTop: '1px solid #E5E5E5',
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            background: '#FAFAFA',
          }}
        >
          {actions}
        </div>
      )}

      <style>{`
        @media (max-width: 520px) {
          .booking-thumb { width: 100% !important; height: 140px; }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <Icon size={14} color="#A3A3A3" style={{ marginTop: 3, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 11, color: '#A3A3A3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ fontWeight: 600, color: '#0A0A0A' }}>{children}</div>
      </div>
    </div>
  );
}
