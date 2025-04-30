'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';

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

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie('token');
    const userCookie = getCookie('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userCookie) {
      try {
        const userData: User = JSON.parse(userCookie as string);
        setUser(userData);
      } catch {
        // Handle error
      }
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all auth cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Digital Assets</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role.name === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Admin Dashboard
                </button>
              )}
              {user?.role.name === 'creator' && (
                <Link
                  href="/creator/import"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Import Assets
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Digital Assets</h2>
            <p>This is a protected page. Only authenticated users can see this content.</p>
            {user && (
              <div className="mt-4">
                <p>Logged in as: {user.email}</p>
                <p>Role: {user.role.name}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
