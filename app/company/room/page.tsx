'use client';

import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'
import { useEffect, useState } from 'react';

const CompanyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/chatwork/get_room_id');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }
        
        setRooms(data.rooms);
      } catch{
        setError('ルーム情報の取得に失敗しました');
      }
    };

    fetchRooms();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-red-500">{error}</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">チャットワークルーム一覧</h1>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    チャットワークルームID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ルーム名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ルームタイプ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room: { room_id: number, name: string, type: string } ) => (
                  <tr key={room.room_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.room_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyRooms;
