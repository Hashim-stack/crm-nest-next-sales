import '../styles/globals.css';
import { Provider, useDispatch } from 'react-redux';
import { store, setTheme, THEMES, applyThemeVars } from '../store';
import { useEffect } from 'react';

function ThemeLoader() {
  const dispatch = useDispatch();
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const id = saved && THEMES[saved] ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'emerald';
    applyThemeVars(id);         
    dispatch(setTheme(id));      
  }, []);
  return null;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeLoader />
      <Component {...pageProps} />
    </Provider>
  );
}
