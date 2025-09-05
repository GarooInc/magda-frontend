import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

function useAuthStatus() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await fetchAuthSession();
        const hasTokens = !!session.tokens?.idToken;
        if (hasTokens) {
          await getCurrentUser();
        }
        if (mounted) setIsAuthed(hasTokens);
      } catch {
        if (mounted) setIsAuthed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { loading, isAuthed };
}

export default function PrivateRoute() {
  const { loading, isAuthed } = useAuthStatus();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando…</div>;
  }

  return isAuthed
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}
