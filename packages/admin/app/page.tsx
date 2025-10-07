import { MqttConfig } from '@warsawjs/core';
import { AdminDashboard } from '../components/admin-dashboard'
import { auth, login } from './actions/auth.actions';
import { Resource } from 'sst';
import { RealtimeProvider } from '@/lib/realtime-provider';

export default async function AdminPage() {
  const user = await auth();

  if (!user) {
    await login();
  }
  // Server-side only: access SST Resources
  const realtimeConfig: MqttConfig = {
    endpoint: Resource.Realtime.endpoint,
    authorizerToken: Resource.RealtimeAuthorizerToken.value,
    authorizerName: Resource.Realtime.authorizer,
    appName: Resource.App.name,
    stage: Resource.App.stage,
  };

  return (
  <RealtimeProvider config={realtimeConfig}>
    <AdminDashboard />
  </RealtimeProvider>
  );
}
