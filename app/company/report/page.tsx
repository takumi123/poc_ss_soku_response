'use client';

import { useParams } from 'next/navigation';
import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'

const CompanyReport = () => {
  const params = useParams();
  const companyId = params.company_id;

  // TODO: Prismaを使用してレポートデータを取得
  // const reportData = await prisma.company.findUnique({
  //   where: { id: companyId },
  //   include: {
  //     messages: {
  //       where: {
  //         createdAt: {
  //           gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
  //         }
  //       }
  //     },
  //     rooms: true,
  //     users: true,
  //   }
  // });

  // デモデータ
  const companyData = {
    id: companyId,
    name: "デモ株式会社",
    monthlyStats: {
      totalMessages: 5432,
      activeRooms: 23,
      averageResponseTime: 1.8,
      messagesByType: {
        chat: 4200,
        notification: 800,
        system: 432
      },
      topActiveRooms: [
        { name: '営業部', messages: 1200 },
        { name: '開発部', messages: 980 },
        { name: '管理部', messages: 750 }
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{companyData.name}のレポート</h1>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">月間利用統計</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-600">メッセージ総数</h3>
                <p className="text-2xl font-semibold">{companyData.monthlyStats.totalMessages}</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-600">アクティブルーム数</h3>
                <p className="text-2xl font-semibold">{companyData.monthlyStats.activeRooms}</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-600">平均応答時間</h3>
                <p className="text-2xl font-semibold">{companyData.monthlyStats.averageResponseTime}時間</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">メッセージ種別内訳</h3>
                <div className="mt-2 space-y-2">
                  {Object.entries(companyData.monthlyStats.messagesByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-sm text-gray-500">{type}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyReport;
