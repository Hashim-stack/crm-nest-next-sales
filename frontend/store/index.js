import { configureStore, createSlice } from '@reduxjs/toolkit';

// ─── Theme definitions (exported for use in components) ────────────────────
export const THEMES = {
  emerald: { id: 'emerald', name: 'Emerald',  emoji: '🟢', dark: false, primary: '#059669', secondary: '#10B981' },
  dark:    { id: 'dark',    name: 'Dark',      emoji: '🌑', dark: true,  primary: '#10B981', secondary: '#34D399' },
  ocean:   { id: 'ocean',   name: 'Ocean',     emoji: '🌊', dark: true,  primary: '#0077B6', secondary: '#00B4D8' },
  purple:  { id: 'purple',  name: 'Midnight',  emoji: '🌌', dark: true,  primary: '#7C3AED', secondary: '#A855F7' },
  sunset:  { id: 'sunset',  name: 'Sunset',    emoji: '🌅', dark: false, primary: '#EA580C', secondary: '#F97316' },
};

// CSS variable map per theme
const THEME_VARS = {
  emerald: {
    '--bg-base': '#F0FDF4', '--bg-card': '#FFFFFF', '--bg-sidebar': '#FFFFFF',
    '--bg-input': '#F0FDF4', '--bg-hover': '#ECFDF5', '--bg-user-pill': '#F0FDF4',
    '--border': '#D1FAE5', '--border-strong': '#6EE7B7',
    '--text-base': '#0F172A', '--text-muted': '#64748B', '--text-faint': '#94A3B8',
    '--accent': '#059669', '--accent-2': '#10B981',
    '--accent-light': '#D1FAE5', '--accent-text': '#065F46',
    '--grad-from': '#059669', '--grad-to': '#10B981',
    '--shadow': 'rgba(16,185,129,0.25)',
  },
  dark: {
    '--bg-base': '#0A0F0A', '--bg-card': '#111827', '--bg-sidebar': '#0D1117',
    '--bg-input': '#1F2937', '--bg-hover': '#1a2e22', '--bg-user-pill': '#1F2937',
    '--border': '#1F2937', '--border-strong': '#065F46',
    '--text-base': '#F1F5F9', '--text-muted': '#94A3B8', '--text-faint': '#475569',
    '--accent': '#10B981', '--accent-2': '#34D399',
    '--accent-light': '#064E3B', '--accent-text': '#6EE7B7',
    '--grad-from': '#065F46', '--grad-to': '#059669',
    '--shadow': 'rgba(16,185,129,0.2)',
  },
  ocean: {
    '--bg-base': '#0C1A2E', '--bg-card': '#112240', '--bg-sidebar': '#0A192F',
    '--bg-input': '#1D3557', '--bg-hover': '#1B3A5C', '--bg-user-pill': '#1D3557',
    '--border': '#1D3557', '--border-strong': '#2D6A9F',
    '--text-base': '#CCD6F6', '--text-muted': '#8892B0', '--text-faint': '#4A5578',
    '--accent': '#64FFDA', '--accent-2': '#00B4D8',
    '--accent-light': '#0D3349', '--accent-text': '#64FFDA',
    '--grad-from': '#0077B6', '--grad-to': '#00B4D8',
    '--shadow': 'rgba(100,255,218,0.15)',
  },
  purple: {
    '--bg-base': '#0F0A1E', '--bg-card': '#1A1033', '--bg-sidebar': '#120D28',
    '--bg-input': '#241848', '--bg-hover': '#2D1F5E', '--bg-user-pill': '#241848',
    '--border': '#2D1F5E', '--border-strong': '#6D28D9',
    '--text-base': '#EDE9FE', '--text-muted': '#A78BFA', '--text-faint': '#6D5C9E',
    '--accent': '#A855F7', '--accent-2': '#C084FC',
    '--accent-light': '#3B0764', '--accent-text': '#E9D5FF',
    '--grad-from': '#7C3AED', '--grad-to': '#A855F7',
    '--shadow': 'rgba(168,85,247,0.25)',
  },
  sunset: {
    '--bg-base': '#FFF7ED', '--bg-card': '#FFFFFF', '--bg-sidebar': '#FFFFFF',
    '--bg-input': '#FFF7ED', '--bg-hover': '#FFEDD5', '--bg-user-pill': '#FFF7ED',
    '--border': '#FED7AA', '--border-strong': '#FB923C',
    '--text-base': '#1C0A00', '--text-muted': '#78350F', '--text-faint': '#92400E',
    '--accent': '#EA580C', '--accent-2': '#F97316',
    '--accent-light': '#FED7AA', '--accent-text': '#7C2D12',
    '--grad-from': '#EA580C', '--grad-to': '#F97316',
    '--shadow': 'rgba(234,88,12,0.25)',
  },
};

export function applyThemeVars(themeId) {
  if (typeof document === 'undefined') return;
  const vars = THEME_VARS[themeId] || THEME_VARS.emerald;
  const theme = THEMES[themeId] || THEMES.emerald;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (theme.dark) root.classList.add('dark');
  else root.classList.remove('dark');
}

// ─── Auth slice ────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setAuth:  (state, { payload }) => { state.user = payload.user; state.token = payload.token; },
    logout:   (state) => {
      state.user = null; state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

// ─── Theme slice ───────────────────────────────────────────────────────────
const themeSlice = createSlice({
  name: 'theme',
  initialState: { id: 'emerald' },
  reducers: {
    setTheme: (state, { payload }) => {
      state.id = THEMES[payload] ? payload : 'emerald';
      applyThemeVars(state.id);
      if (typeof window !== 'undefined') localStorage.setItem('theme', state.id);
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export const { setTheme }        = themeSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer, theme: themeSlice.reducer },
});
