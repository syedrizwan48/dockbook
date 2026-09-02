/** Shared UI primitives */

export function PageHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            marginBottom: 6,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: '#525252', fontSize: 15, maxWidth: 560 }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, style = {}, padding = 24 }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: '2px solid #E5E5E5',
        padding,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  type = 'button',
  onClick,
  style = {},
  fullWidth,
  icon: Icon,
}) {
  const variants = {
    primary: {
      background: '#F5E642',
      color: '#0A0A0A',
      border: '2px solid #0A0A0A',
      hoverBg: '#E6D520',
    },
    dark: {
      background: '#0A0A0A',
      color: '#FFFFFF',
      border: '2px solid #0A0A0A',
      hoverBg: '#1A1A1A',
    },
    outline: {
      background: '#FFFFFF',
      color: '#0A0A0A',
      border: '2px solid #0A0A0A',
      hoverBg: '#F7F7F7',
    },
    success: {
      background: '#16A34A',
      color: '#FFFFFF',
      border: '2px solid #14532D',
      hoverBg: '#15803D',
    },
    danger: {
      background: '#DC2626',
      color: '#FFFFFF',
      border: '2px solid #7F1D1D',
      hoverBg: '#B91C1C',
    },
    ghost: {
      background: 'transparent',
      color: '#525252',
      border: '2px solid transparent',
      hoverBg: '#F5F5F5',
    },
  };
  const v = variants[variant] || variants.primary;
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13 },
    md: { padding: '12px 20px', fontSize: 14 },
    lg: { padding: '14px 28px', fontSize: 16 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 700,
        borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, transform 0.1s',
        width: fullWidth ? '100%' : 'auto',
        background: v.background,
        color: v.color,
        border: v.border,
        ...s,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = v.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = v.background;
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

export function Input({ label, error, id, ...props }) {
  const inputId = id || props.name;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 700,
            color: '#0A0A0A',
            marginBottom: 6,
            letterSpacing: '0.01em',
          }}
        >
          {label}
          {props.required && <span style={{ color: '#DC2626' }}> *</span>}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: error ? '2px solid #DC2626' : '2px solid #D4D4D4',
          fontSize: 15,
          background: '#FFFFFF',
          color: '#0A0A0A',
          outline: 'none',
          transition: 'border-color 0.15s',
          ...(props.style || {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#F5E642';
          e.target.style.boxShadow = '0 0 0 3px rgba(245,230,66,0.35)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#DC2626' : '#D4D4D4';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4, fontWeight: 600 }}>{error}</div>
      )}
    </div>
  );
}

export function Select({ label, error, id, children, ...props }) {
  const inputId = id || props.name;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 700,
            color: '#0A0A0A',
            marginBottom: 6,
          }}
        >
          {label}
          {props.required && <span style={{ color: '#DC2626' }}> *</span>}
        </label>
      )}
      <select
        id={inputId}
        {...props}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: error ? '2px solid #DC2626' : '2px solid #D4D4D4',
          fontSize: 15,
          background: '#FFFFFF',
          color: '#0A0A0A',
          outline: 'none',
          cursor: 'pointer',
          ...(props.style || {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#F5E642';
          e.target.style.boxShadow = '0 0 0 3px rgba(245,230,66,0.35)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#DC2626' : '#D4D4D4';
          e.target.style.boxShadow = 'none';
        }}
      >
        {children}
      </select>
      {error && (
        <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4, fontWeight: 600 }}>{error}</div>
      )}
    </div>
  );
}

export function Textarea({ label, error, id, ...props }) {
  const inputId = id || props.name;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 700,
            color: '#0A0A0A',
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: error ? '2px solid #DC2626' : '2px solid #D4D4D4',
          fontSize: 15,
          background: '#FFFFFF',
          color: '#0A0A0A',
          outline: 'none',
          resize: 'vertical',
          minHeight: 80,
          fontFamily: 'inherit',
          ...(props.style || {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#F5E642';
          e.target.style.boxShadow = '0 0 0 3px rgba(245,230,66,0.35)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#DC2626' : '#D4D4D4';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: '#FFFFFF',
        borderRadius: 14,
        border: '2px dashed #D4D4D4',
      }}
    >
      {Icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: '#FFFCE0',
            border: '2px solid #F5E642',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Icon size={28} color="#0A0A0A" />
        </div>
      )}
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
      {description && (
        <p style={{ color: '#737373', fontSize: 14, maxWidth: 360, margin: '0 auto 20px' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div
      style={{
        background: accent ? '#F5E642' : '#FFFFFF',
        border: accent ? '2px solid #0A0A0A' : '2px solid #E5E5E5',
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: accent ? '#0A0A0A' : '#FFFCE0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={accent ? '#F5E642' : '#0A0A0A'} />
      </div>
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: accent ? '#0A0A0A' : '#737373',
            opacity: 0.8,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export function Alert({ children, type = 'info' }) {
  const styles = {
    info: { bg: '#FFFCE0', border: '#F5E642', color: '#0A0A0A' },
    error: { bg: '#FEE2E2', border: '#DC2626', color: '#7F1D1D' },
    success: { bg: '#DCFCE7', border: '#16A34A', color: '#14532D' },
    warning: { bg: '#FEF3C7', border: '#F59E0B', color: '#92400E' },
  };
  const s = styles[type] || styles.info;
  return (
    <div
      style={{
        background: s.bg,
        border: `2px solid ${s.border}`,
        color: s.color,
        borderRadius: 12,
        padding: '14px 16px',
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}
