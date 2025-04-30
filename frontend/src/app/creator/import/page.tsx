'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface ImportJob {
  id: number;
  creator_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error: string | null;
  created_at: string;
  updated_at: string;
  import_records?: ImportRecord[];
}

interface ImportRecord {
  id: number;
  import_job_id: number;
  title: string;
  description: string;
  file_url: string;
  price: number | null;
  status: 'imported' | 'failed';
  error: string | null;
  created_at: string;
  updated_at: string;
}

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [job, setJob] = useState<ImportJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setJob(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/api/v1/assets/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Start polling for job status
      pollJobStatus();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
      setLoading(false);
    }
  };

  const pollJobStatus = async () => {
    const poll = async () => {
      try {
        const { data } = await api.get<{ data: ImportJob }>('/api/v1/assets/jobs/latest');
        
        if (data.data) {
          setJob(data.data);

          if (data.data.status === 'processing') {
            // Continue polling
            setTimeout(poll, 2000);
          } else {
            setLoading(false);
          }
        } else {
          // No job found yet, continue polling
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        setError('Failed to check import status');
        setLoading(false);
      }
    };

    poll();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Import Assets</h1>
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
                Import Assets
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Upload a JSON file to import your assets
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    JSON File
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>
            </div>
          </div>

          {job && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Import Status
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Job ID: {job.id} | Status: {job.status}
                </p>
              </div>
              {job.import_records && (
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {job.import_records.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {record.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {record.price ? `$${record.price.toFixed(2)}` : '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  record.status === 'imported'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-red-600">
                                {record.error}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 