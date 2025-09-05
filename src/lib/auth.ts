// auth.ts
import type { SignUpOutput } from 'aws-amplify/auth';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  fetchAuthSession,
} from 'aws-amplify/auth';

const ORIGINAL_EXP_KEY = 'original_exp';

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
  return amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
    },
  });
};


export async function isSignedIn(): Promise<boolean> {
  try {
    const session = await fetchAuthSession();
    return !!session.tokens?.idToken; // si hay tokens, hay sesión
  } catch {
    return false;
  }
}

export const signIn = async (email: string, password: string) => {
  const alreadyIn = await isSignedIn();
  if (alreadyIn) {
    return fetchAuthSession();
  }

  await amplifySignIn({ username: email, password });

  return fetchAuthSession();
};


export const signOut = async (): Promise<void> => {
  await amplifySignOut(); 
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