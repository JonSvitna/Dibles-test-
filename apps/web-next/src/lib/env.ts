// Environment variable utilities
export const env = {
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  apiBase: process.env.API_BASE || '',
};

export function isDemoMode(): boolean {
  return env.isDemoMode;
}
