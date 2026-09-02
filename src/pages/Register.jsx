import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Input, Button, Alert } from '../components/ui';
import { AuthShell } from './Login';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    company: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const res = register(form);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <AuthShell title="Create account" subtitle="Register to book a loading bay.">
      <form onSubmit={onSubmit}>
        {error && <Alert type="error">{error}</Alert>}
        <Input
          label="Full name"
          name="name"
          required
          placeholder="Jane Smith"
          value={form.name}
          onChange={onChange}
          autoComplete="name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />
        <Input
          label="Company / organisation"
          name="company"
          placeholder="Acme Logistics"
          value={form.company}
          onChange={onChange}
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+61 400 000 000"
          value={form.phone}
          onChange={onChange}
          autoComplete="tel"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          name="confirm"
          type="password"
          required
          placeholder="Repeat password"
          value={form.confirm}
          onChange={onChange}
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth size="lg" disabled={loading} icon={UserPlus}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#525252' }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: '#0A0A0A', fontWeight: 700, borderBottom: '2px solid #F5E642' }}>
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
