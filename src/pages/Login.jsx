import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Input, Button, Alert, Card } from '../components/ui';
import { Truck, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = login(form);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate(res.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Book a loading bay in seconds — 24/7 access."
    >
      <form onSubmit={onSubmit}>
        {error && <Alert type="error">{error}</Alert>}
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={onChange}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
        />
        <Button type="submit" fullWidth size="lg" disabled={loading} icon={LogIn}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#525252' }}>
        Don&apos;t have an account?{' '}
        <Link to="/register" style={{ color: '#0A0A0A', fontWeight: 700, borderBottom: '2px solid #F5E642' }}>
          Register
        </Link>
      </div>

      <div
        style={{
          marginTop: 28,
          padding: 14,
          background: '#FAFAFA',
          borderRadius: 10,
          border: '1px dashed #D4D4D4',
          fontSize: 12,
          color: '#737373',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: '#0A0A0A' }}>Demo admin:</strong> admin@dock.com / admin123
      </div>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0A0A0A',
      }}
    >
      {/* Brand strip */}
      <div
        style={{
          height: 6,
          background: 'linear-gradient(90deg, #F5E642 0%, #FFF9B0 50%, #F5E642 100%)',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: '#F5E642',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(245,230,66,0.4)',
              }}
            >
              <Truck size={32} color="#0A0A0A" strokeWidth={2.5} />
            </div>
            <h1
              style={{
                color: '#FFFFFF',
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: 6,
              }}
            >
              DockBook
            </h1>
            <p style={{ color: '#A3A3A3', fontSize: 14 }}>Loading Bay Manager</p>
          </div>

          <Card style={{ border: '2px solid #F5E642' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{title}</h2>
            <p style={{ color: '#737373', fontSize: 14, marginBottom: 24 }}>{subtitle}</p>
            {children}
          </Card>

          <p
            style={{
              textAlign: 'center',
              marginTop: 24,
              color: '#525252',
              fontSize: 12,
            }}
          >
            3 bays · 24/7 access · Max 4 hours per booking · 2 bookings / day
          </p>
        </div>
      </div>
    </div>
  );
}
