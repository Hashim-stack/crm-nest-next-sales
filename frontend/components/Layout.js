import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store';
import ThemePicker from './ThemePicker';

const adminNav = [
  { href: '/dashboard/admin', label: 'Dashboard',  icon: '⬡' },
  { href: '/leads',           label: 'Leads',      icon: '◈' },
  { href: '/students',        label: 'Students',   icon: '◉' },
  { href: '/courses',         label: 'Courses',    icon: '▣' },
  { href: '/counselors',      label: 'Counselors', icon: '◇' },
];

const counselorNav = [
  { href: '/dashboard/counselor', label: 'Dashboard', icon: '⬡' },
  { href: '/leads',               label: 'My Leads',  icon: '◈' },
  { href: '/students',            label: 'Students',  icon: '◉' },
];

export default function Layout({ children }) {
  const router   = useRouter();
  const dispatch = useDispatch();
  const user     = useSelector(s => s.auth.user);
  const nav      = user?.role === 'ADMIN' ? adminNav : counselorNav;

  const s = {
    wrap:    { display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-base)', transition:'background 0.25s' },
    sidebar: { width:224, flexShrink:0, background:'var(--bg-sidebar)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'24px 12px', transition:'background 0.25s, border-color 0.25s' },
    logo:    { fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:800, color:'var(--accent)', letterSpacing:'-0.5px', padding:'0 8px', marginBottom:32 },
    sub:     { fontSize:10, color:'var(--text-faint)', letterSpacing:'0.12em', fontWeight:700 },
    nav:     { display:'flex', flexDirection:'column', gap:4, flex:1 },
    divider: { borderTop:'1px solid var(--border)', paddingTop:14, marginTop:14 },
    pill:    { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'var(--bg-user-pill)', marginBottom:8 },
    avatar:  { width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,var(--grad-from),var(--grad-to))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0 },
    uname:   { fontSize:12, fontWeight:600, color:'var(--text-base)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
    urole:   { fontSize:10, color:'var(--accent)', fontWeight:600 },
    bottom:  { display:'flex', alignItems:'center', gap:8, padding:'0 4px' },
    signout: { flex:1, fontSize:12, fontWeight:500, color:'var(--text-faint)', background:'none', border:'none', cursor:'pointer', textAlign:'left', padding:'6px 8px', borderRadius:8, transition:'color 0.2s', fontFamily:"'DM Sans',sans-serif" },
    main:    { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
    content: { flex:1, overflow:'auto', padding:28 },
  };

  return (
    <div style={s.wrap}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          UP<span style={{ color:'var(--text-base)' }}>CODE</span>
          <div style={s.sub}>CRM PLATFORM</div>
        </div>

        <nav style={s.nav}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} style={{ textDecoration:'none' }}>
              <div className={`nav-link${router.pathname === n.href ? ' active' : ''}`}>
                <span style={{ fontSize:16 }}>{n.icon}</span>
                {n.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={s.divider}>
          <div style={s.pill}>
            <div style={s.avatar}>{user?.name?.split(' ').map(w=>w[0]).join('')||'U'}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={s.uname}>{user?.name||'User'}</div>
              <div style={s.urole}>{user?.role}</div>
            </div>
          </div>
          <div style={s.bottom}>
            <ThemePicker />
            <button
              style={s.signout}
              onClick={() => { dispatch(logout()); router.push('/'); }}
              onMouseEnter={e => e.currentTarget.style.color='#EF4444'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-faint)'}
            >
              Sign out →
            </button>
          </div>
        </div>
      </aside>

      <div style={s.main}>
        <main style={s.content}>{children}</main>
      </div>
    </div>
  );
}
