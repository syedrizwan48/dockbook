import { useApp } from '../context';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  };
  const Icon = icons[toast.type] || Info;

  const colors = {
    success: { bg: '#DCFCE7', border: '#16A34A', text: '#14532D' },
    error: { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D' },
    info: { bg: '#FFFCE0', border: '#E6D520', text: '#1A1A1A' },
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        background: c.bg,
        border: `2px solid ${c.border}`,
        borderRadius: 12,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        color: c.text,
        maxWidth: 380,
        animation: 'slideIn 0.3s ease',
      }}
    >
      <Icon size={22} strokeWidth={2.5} />
      <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{toast.message}</span>
      {/* Auto-dismisses after a few seconds */}
      <span style={{ width: 16, opacity: 0.4 }} aria-hidden>
        <X size={16} />
      </span>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
