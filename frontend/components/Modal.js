import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const h = e => { if (e.key==='Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:22, padding:28, width:'100%', maxWidth:460, boxShadow:'0 24px 64px rgba(0,0,0,0.25)', animation:'fadeUp 0.18s ease' }}>
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'var(--text-base)' }}>{title}</h2>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:'50%', background:'var(--bg-input)', border:'1px solid var(--border)', color:'var(--text-muted)', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.12)';e.currentTarget.style.color='#EF4444';}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-input)';e.currentTarget.style.color='var(--text-muted)';}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
