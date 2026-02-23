import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token && verifyToken(token)) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003d6b] to-[#1e293b]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-white tracking-widest">PEKCON</div>
          <div className="text-blue-300 text-sm tracking-wider mt-1 uppercase">Admin Paneli</div>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">Giriş Yapın</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
