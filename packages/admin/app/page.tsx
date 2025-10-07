import { MqttConfig, DemoStateDB } from '@warsawjs/core';
import { AdminDashboard } from '../components/admin-dashboard'
import { auth, login, getAccessToken } from './actions/auth.actions';
import { Resource } from 'sst';
import { RealtimeProvider } from '@/lib/realtime-provider';
import { headers } from 'next/headers';

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  // Force Next.js to treat this as dynamic by accessing headers
  await headers();

  const user = await auth();

  if (!user) {
    await login();
  }

  // Get JWT token for MQTT authorization
  const jwtToken = await getAccessToken();

  if (!jwtToken) {
    await login();
  }

  // Server-side only: access SST Resources
  // Admin uses JWT token for authentication via JWKS
  const realtimeConfig: MqttConfig = {
    endpoint: Resource.Realtime.endpoint,
    authorizerToken: jwtToken!,
    authorizerName: Resource.Realtime.authorizer,
    appName: Resource.App.name,
    stage: Resource.App.stage,
  };

  // Load initial demo state from database
  const initialState = await DemoStateDB.get().catch(() => null);

  return (
  <RealtimeProvider config={realtimeConfig}>
    <AdminDashboard
      initialChatEnabled={initialState?.chatEnabled}
      initialVoteEnabled={initialState?.voteEnabled}
      initialEmailEnabled={initialState?.emailEnabled}
    />
  </RealtimeProvider>
  );
}
