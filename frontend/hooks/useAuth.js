import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setAuth } from '../store';

/**
 * Restores auth from localStorage on every page load.
 * Returns { user, ready } — only make API calls when ready === true.
 */
export default function useAuth(requiredRole = null) {
  const dispatch = useDispatch();
  const router = useRouter();
  const storeUser = useSelector((s) => s.auth.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');

    if (!token || !raw) {
      router.replace('/');
      return;
    }

    const user = JSON.parse(raw);

    // Always re-hydrate Redux so Axios interceptor has the token
    dispatch(setAuth({ token, user }));

    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/counselor');
      return;
    }

    setReady(true);
  }, []);

  return { user: storeUser, ready };
}
