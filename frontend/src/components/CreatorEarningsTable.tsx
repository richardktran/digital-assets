'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Creator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface CreatorEarning {
  creator: Creator;
  total_earnings: number;
}

interface CreatorEarningsResponse {
  data: CreatorEarning[];
}

export default function CreatorEarningsTable() {
  const [earnings, setEarnings] = useState<CreatorEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await api.get<CreatorEarningsResponse>('/api/v1/admin/statistics/creators_earning');
        setEarnings(data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching creator earnings:', error);
        setError('Failed to fetch creator earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Earnings
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {earnings && earnings.map((earning) => (
            <tr key={earning.creator.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {earning.creator.first_name} {earning.creator.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {earning.creator.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  ${earning.total_earnings.toFixed(2)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 