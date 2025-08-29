// auth.ts
import type { SignUpOutput } from 'aws-amplify/auth';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  fetchAuthSession,
} from 'aws-amplify/auth';

const ORIGINAL_EXP_KEY = 'original_exp';
const COGNITO_TOKEN_KEY = 'cognitoToken'; // si lo usas en otra parte, lo dejamos por compat

// ---- Helpers ----
function isTokenValidFromStorage(): boolean {
  const expirationTime = localStorage.getItem(ORIGINAL_EXP_KEY);
  if (!expirationTime) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpirationTime = Number.parseInt(expirationTime, 10);
  return Number.isFinite(tokenExpirationTime) && currentTime < tokenExpirationTime;
}

// ---- API pública (misma firma que tu código original) ----

export const signUp = (email: string, password: string): Promise<SignUpOutput> => {
  // Amplify requiere username. Usamos el correo como username por simplicidad.
  return amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
      // autoSignIn: { enabled: true }, // opcional
    },
  });
};

export const signIn = async (email: string, password: string) => {
  // Inicia sesión con Amplify
  const result = await amplifySignIn({ username: email, password });

  // Si hay nextStep (MFA, confirmación, etc.), puedes manejarlo aquí según tu UX.
  // Para mantener compatibilidad con tu API previa, devolvemos la "session" de Amplify.
  const session = await fetchAuthSession();

  // Guardar exp del ID token (número UNIX en segundos)
  const exp = session.tokens?.idToken?.payload?.exp as number | undefined;
  if (typeof exp === 'number') {
    localStorage.setItem(ORIGINAL_EXP_KEY, String(exp));
  }

  // Guardar el propio token si lo necesitas en otras capas:
  const idJwt = session.tokens?.idToken?.toString();
  if (idJwt) {
    localStorage.setItem(COGNITO_TOKEN_KEY, idJwt);
  }

  return session; // similar a lo que devolvías antes
};

export const signOut = async (): Promise<void> => {
  await amplifySignOut(); // cierra sesión en Cognito
  localStorage.removeItem(ORIGINAL_EXP_KEY);
  localStorage.removeItem(COGNITO_TOKEN_KEY);
};

export const checkSession = async () => {
  // Obtén la sesión actual de Amplify
  const session = await fetchAuthSession();

  // Si no hay tokens, lo consideramos no autenticado
  if (!session.tokens?.idToken) {
    throw new Error('No user found');
  }

  // Validación con la expiración guardada (se mantiene tu lógica original)
  if (!isTokenValidFromStorage()) {
    throw new Error('Session expired');
  }

  return session;
};