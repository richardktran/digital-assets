'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import api from '@/lib/axios';

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

interface Asset {
  id: number;
  title: string;
  description: string;
  price: number;
  creator_id: number;
  asset_files: {
    file_url: string;
  };
  accessible: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    const token = getCookie('token');
    const userCookie = getCookie('user');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserAndAssets = async () => {
      if (userCookie) {
        try {
          const userData: User = JSON.parse(userCookie as string);
          setUser(userData);

          // Fetch assets after user is set
          try {
            const { data } = await api.get<{ data: Asset[] }>('/api/v1/assets');
            const assetsWithAccess = data.data.map(asset => ({
              ...asset,
              accessible: asset.creator_id === userData.id || userData.role.name === 'admin'
            }));
            setAssets(assetsWithAccess);
          } catch (error) {
            console.error('Error fetching assets:', error);
            setError('Failed to fetch assets');
          }
        } catch {
          setError('Failed to parse user data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserAndAssets();
  }, [router]);

  const handleLogout = () => {
    // Clear all auth cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const handleAddToCart = (assetId: number) => {
    if (!cart.includes(assetId)) {
      setCart([...cart, assetId]);
    }
  };

  const handleRemoveFromCart = (assetId: number) => {
    setCart(cart.filter(id => id !== assetId));
  };

  const handlePurchase = async () => {
    if (cart.length === 0) return;

    try {
      const idempotencyKey = `order-${Date.now()}`;
      await api.post('/api/v1/orders', {
        orders: {
          idempotency_key: idempotencyKey,
          asset_ids: cart,
        }
      });
      setCart([]);
      alert('Purchase successful!');
      // Reload assets to update access status
      const { data } = await api.get<{ data: Asset[] }>('/api/v1/assets');
      const assetsWithAccess = data.data.map(asset => ({
        ...asset,
        accessible: asset.creator_id === user?.id || user?.role.name === 'admin'
      }));
      setAssets(assetsWithAccess);
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <>
                  <Link
                    href="/creator/assets"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    My Assets
                  </Link>
                  <Link
                    href="/creator/import"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Import Assets
                  </Link>
                </>
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
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Available Assets
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Browse and purchase digital assets
            </p>
          </div>

          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {asset.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {asset.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${asset.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {asset.asset_files ? (
                          <a
                            href={asset.asset_files.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Download
                          </a>
                        ) : cart.includes(asset.id) ? (
                          <button
                            onClick={() => handleRemoveFromCart(asset.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Remove from Cart
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(asset.id)}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Shopping Cart
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {cart.length} item(s) in cart
              </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <button
                onClick={handlePurchase}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Purchase ({cart.length} items)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
