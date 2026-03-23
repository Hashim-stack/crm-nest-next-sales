import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, THEMES } from '../store';

const GRADIENTS = {
  emerald: 'linear-gradient(135deg,#059669,#34D399)',
  dark:    'linear-gradient(135deg,#1a2e22,#10B981)',
  ocean:   'linear-gradient(135deg,#0077B6,#64FFDA)',
  purple:  'linear-gradient(135deg,#7C3AED,#C084FC)',
  sunset:  'linear-gradient(135deg,#EA580C,#FCD34D)',
};

export default function ThemePicker() {
  const dispatch  = useDispatch();
  const currentId = useSelector(s => s.theme.id);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Change theme"
        style={{
          width: 36, height: 36, borderRadius: 10, cursor: 'pointer', flexShrink: 0,
          background: GRADIENTS[currentId],
          border: open ? '2.5px solid var(--text-base)' : '2.5px solid var(--border-strong)',
          transition: 'border-color 0.2s, transform 0.15s',
          transform: open ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 10px)', left: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '12px', minWidth: 190, zIndex: 100,
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
          animation: 'fadeUp 0.15s ease',
        }}>
          <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: 10, textTransform: 'uppercase' }}>
            Choose Theme
          </p>
          {Object.values(THEMES).map(t => {
            const active = currentId === t.id;
            return (
              <button key={t.id} onClick={() => { dispatch(setTheme(t.id)); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '7px 9px', borderRadius: 9, cursor: 'pointer',
                  background: active ? 'var(--bg-hover)' : 'transparent',
                  border: active ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                  marginBottom: 3, transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: GRADIENTS[t.id], flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: 'var(--text-base)', flex: 1, textAlign: 'left' }}>
                  {t.emoji} {t.name}
                </span>
                {active && <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
