'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import CreatorEarningsTable from '@/components/CreatorEarningsTable';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role: {
    name: string;
  };
}

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const userCookie = getCookie('user');
    if (!userCookie) {
      router.push('/');
      return;
    }

    try {
      const user: User = JSON.parse(userCookie as string);
      if (user.role.name !== 'admin') {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Creator Earnings
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Overview of creator earnings and sales
              </p>
            </div>
            <div className="border-t border-gray-200">
              <CreatorEarningsTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 