import { Client, Account, Databases, Query, ID, OAuthProvider } from 'appwrite';

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
export const APPWRITE_DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'portfolio';
export const APPWRITE_COMMENTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || 'comments';
export const APPWRITE_REACTIONS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_REACTIONS_COLLECTION_ID || 'reactions';
export const APPWRITE_INQUIRIES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION_ID || 'inquiries';

export const isAppwriteConfigured = Boolean(
  APPWRITE_PROJECT_ID && APPWRITE_PROJECT_ID !== 'your_project_id',
);

export const appwriteClient = new Client();

if (isAppwriteConfigured) {
  appwriteClient.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
}

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);

export interface AppwriteUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'linkedin';
}

/**
 * Trigger OAuth login with Appwrite
 */
export async function loginOAuth(provider: 'google' | 'github' | 'linkedin') {
  if (!isAppwriteConfigured) {
    console.warn('Appwrite project is not configured. Simulating demo session.');
    const demoUser: AppwriteUser = {
      id: `demo-${provider}-${Date.now().toString(36)}`,
      name: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `visitor@${provider}.demo`,
      provider,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_demo_user', JSON.stringify(demoUser));
      window.dispatchEvent(new Event('auth_state_change'));
    }
    return;
  }

  const successUrl = typeof window !== 'undefined' ? window.location.href : '/';
  const failureUrl = typeof window !== 'undefined' ? window.location.href : '/';

  const providerEnum =
    provider === 'google'
      ? OAuthProvider.Google
      : provider === 'github'
        ? OAuthProvider.Github
        : OAuthProvider.Linkedin;

  account.createOAuth2Session(providerEnum, successUrl, failureUrl);
}

/**
 * Retrieve the current authenticated user (or demo session fallback)
 */
export async function getCurrentUser(): Promise<AppwriteUser | null> {
  if (isAppwriteConfigured) {
    try {
      const user = await account.get();
      return {
        id: user.$id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        provider: 'github',
      };
    } catch {
      return null;
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('portfolio_demo_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Log out of Appwrite / clear local session
 */
export async function logoutUser(): Promise<void> {
  if (isAppwriteConfigured) {
    try {
      await account.deleteSession('current');
    } catch (e) {
      console.error('Logout error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('portfolio_demo_user');
    window.dispatchEvent(new Event('auth_state_change'));
  }
}
