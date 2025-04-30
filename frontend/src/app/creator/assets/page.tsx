'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Asset {
  id: number;
  title: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  asset_files: {
    file_url: string;
  };
}

export default function AssetsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    file_url: '',
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data } = await api.get<{ data: Asset[] }>('/api/v1/assets/my');
      setAssets(data.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setEditForm({
      title: asset.title,
      description: asset.description,
      file_url: asset.asset_files.file_url,
    });
  };

  const handleUpdate = async () => {
    if (!editingAsset) return;

    try {
      await api.put(`/api/v1/assets/${editingAsset.id}`, {
        title: editForm.title,
        description: editForm.description,
        asset_file: {
          file_url: editForm.file_url,
        },
      });
      setEditingAsset(null);
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
      setError('Failed to update asset');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      await api.delete(`/api/v1/assets/${id}`);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      setError('Failed to delete asset');
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
              <h1 className="text-xl font-semibold">My Assets</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/creator/import')}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Import Assets
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Home
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
              Your Assets
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your digital assets
            </p>
          </div>

          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {assets.map((asset) => (
                <li key={asset.id} className="px-4 py-4 sm:px-6">
                  {editingAsset?.id === asset.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          File URL
                        </label>
                        <input
                          type="text"
                          value={editForm.file_url}
                          onChange={(e) =>
                            setEditForm({ ...editForm, file_url: e.target.value })
                          }
                          className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdate}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingAsset(null)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {asset.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {asset.description}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Price: ${asset.price}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          File: {asset.asset_files.file_url}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 