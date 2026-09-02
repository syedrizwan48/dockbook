import { statusLabel } from '../data';

const STYLES = {
  pending: { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' },
  approved: { bg: '#DCFCE7', color: '#14532D', border: '#16A34A' },
  rejected: { bg: '#FEE2E2', color: '#7F1D1D', border: '#DC2626' },
  cancelled: { bg: '#F5F5F5', color: '#525252', border: '#A3A3A3' },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || STYLES.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.02em',
        background: s.bg,
        color: s.color,
        border: `1.5px solid ${s.border}`,
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: s.border,
        }}
      />
      {statusLabel(status)}
    </span>
  );
}
