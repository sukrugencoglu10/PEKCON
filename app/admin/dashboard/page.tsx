import { requireAdmin } from '@/lib/admin-auth';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Suspense } from 'react';

export default async function DashboardPage() {
  await requireAdmin();
  return (
    <Suspense>
      <AdminDashboard />
    </Suspense>
  );
}
