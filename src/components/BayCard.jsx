import { BAYS } from '../data';
import { MapPin, Check } from 'lucide-react';

export default function BayCard({ bayId, selected, onSelect, compact = false }) {
  const bay = BAYS.find((b) => b.id === bayId) || BAYS[0];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(bay.id)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: selected ? '#FFFCE0' : '#FFFFFF',
        border: selected ? '3px solid #F5E642' : '2px solid #E5E5E5',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s',
        boxShadow: selected ? '0 8px 24px rgba(245, 230, 66, 0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
        position: 'relative',
        padding: 0,
      }}
    >
      <div style={{ position: 'relative', aspectRatio: compact ? '16/9' : '4/3', overflow: 'hidden' }}>
        <img
          src={bay.image}
          alt={bay.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: '#0A0A0A',
            color: '#F5E642',
            fontWeight: 800,
            fontSize: 13,
            padding: '6px 12px',
            borderRadius: 8,
            letterSpacing: '0.02em',
          }}
        >
          BAY {bay.id}
        </div>
        {selected && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#F5E642',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0A0A0A',
            }}
          >
            <Check size={18} color="#0A0A0A" strokeWidth={3} />
          </div>
        )}
      </div>
      <div style={{ padding: compact ? '12px 14px' : '16px 18px' }}>
        <div style={{ fontWeight: 800, fontSize: compact ? 15 : 17, color: '#0A0A0A', marginBottom: 4 }}>
          {bay.name}
        </div>
        {!compact && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 6,
              fontSize: 13,
              color: '#525252',
            }}
          >
            <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
            {bay.description}
          </div>
        )}
      </div>
    </button>
  );
}
