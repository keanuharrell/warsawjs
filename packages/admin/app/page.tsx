import { AdminDashboard } from './components/admin-dashboard'

export default async function AdminPage() {
  // TODO: Check auth here
  // const session = await getSession()
  // if (!session) redirect('/login')

  return <AdminDashboard />
}
