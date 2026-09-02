import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import {
  LayoutDashboard,
  CalendarPlus,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Truck,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems =
    user?.role === 'admin'
      ? [
          { to: '/admin', label: 'Approvals', icon: ShieldCheck },
          { to: '/admin/schedule', label: 'Schedule', icon: ClipboardList },
        ]
      : [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/book', label: 'New Booking', icon: CalendarPlus },
          { to: '/my-bookings', label: 'My Bookings', icon: ClipboardList },
        ];

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header
        style={{
          background: '#0A0A0A',
          color: '#FFFFFF',
          borderBottom: '4px solid #F5E642',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: '#F5E642',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={22} color="#0A0A0A" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>
                DockBook
              </div>
              <div style={{ fontSize: 11, color: '#F5E642', fontWeight: 600, letterSpacing: '0.04em' }}>
                LOADING BAY MANAGER
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: isActive ? '#0A0A0A' : '#FFFFFF',
                  background: isActive ? '#F5E642' : 'transparent',
                  transition: 'all 0.15s',
                })}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="user-chip" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#A3A3A3' }}>
                {user?.role === 'admin' ? 'Administrator' : user?.company || user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: '#2A2A2A',
                border: 'none',
                color: '#FFFFFF',
                width: 40,
                height: 40,
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={18} />
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                background: '#F5E642',
                border: 'none',
                color: '#0A0A0A',
                width: 40,
                height: 40,
                borderRadius: 10,
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            style={{
              background: '#1A1A1A',
              padding: '12px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  color: isActive ? '#0A0A0A' : '#FFFFFF',
                  background: isActive ? '#F5E642' : 'transparent',
                })}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '28px 20px 60px' }}>
        {children}
      </main>

      <footer
        style={{
          background: '#0A0A0A',
          color: '#A3A3A3',
          borderTop: '3px solid #F5E642',
          padding: '18px 20px',
          textAlign: 'center',
          fontSize: 13,
        }}
      >
        <span style={{ color: '#F5E642', fontWeight: 700 }}>DockBook</span>
        {' · '}3 loading bays · Accessible 24/7 · Max 4 hrs / booking · Max 2 bookings / day
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .user-chip { display: none !important; }
        }
      `}</style>
    </div>
  );
}
