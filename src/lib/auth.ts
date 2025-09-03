// auth.ts
import type { SignUpOutput } from 'aws-amplify/auth';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  fetchAuthSession,
} from 'aws-amplify/auth';

const ORIGINAL_EXP_KEY = 'original_exp';
const COGNITO_TOKEN_KEY = 'cognitoToken'; 

// ---- Helpers ----
export function isTokenValidFromStorage(): boolean {
  const expirationTime = localStorage.getItem(ORIGINAL_EXP_KEY);
  if (!expirationTime) return false
  else {
    return true;
  }
}

// ---- API pública  ----
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
  await amplifySignIn({ username: email, password });

  const session = await fetchAuthSession();

  const exp = session.tokens?.idToken?.payload?.exp as number | undefined;
  if (typeof exp === 'number') {
    localStorage.setItem(ORIGINAL_EXP_KEY, String(exp));
  }

  const idJwt = session.tokens?.idToken?.toString();
  if (idJwt) {
    localStorage.setItem(COGNITO_TOKEN_KEY, idJwt);
  }

  return session; 
};

export const signOut = async (): Promise<void> => {
  await amplifySignOut(); 
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

  if (!isTokenValidFromStorage()) {
    throw new Error('Session expired');
  }

  return session;
};