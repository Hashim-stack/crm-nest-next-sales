import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import api from '../lib/axios';
import { setAuth } from '../store';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const router   = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(setAuth({ token, user }));
      router.push(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/counselor');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', transition: 'background 0.25s' }}>
      <div style={{ width: '100%', maxWidth: '22rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '4rem', height: '4rem', borderRadius: '1rem',
            background: 'linear-gradient(135deg, var(--nav-active-from), var(--nav-active-to))',
            boxShadow: '0 8px 24px var(--shadow-accent)', marginBottom: '1rem',
          }}>
            <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>U</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-base)' }}>
            up<span style={{ color: 'var(--accent)' }}>code</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="Name@upcode.in"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="•••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', fontSize: '0.875rem', borderRadius: '0.75rem', padding: '0.625rem 1rem' }}>
                {error}
              </div>
            )}

            <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </div>

          {/* Role hints */}
          {/* <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[['Manager','Full access + analytics','var(--accent-light)','var(--accent-text)'],
              ['Counselor','Leads + students','var(--bg-input)','var(--text-muted)']].map(([role,desc,bg,col]) => (
              <div key={role} style={{ background: bg, borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: col }}>{role}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>{desc}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
