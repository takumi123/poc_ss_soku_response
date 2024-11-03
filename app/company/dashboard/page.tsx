'use client';

import { useParams } from 'next/navigation';
import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'

const CompanyDashboard = () => {
  const params = useParams();
  const companyId = params.company_id;

  // TODO: Prismaを使用して会社情報を取得
  // const company = await prisma.company.findUnique({
  //   where: { id: companyId },
  //   include: {
  //     users: true,
  //     rooms: true,
  //     messages: true,
  //   }
  // });

  // デモデータ
  const companyData = {
    id: companyId,
    name: "デモ株式会社",
    stats: {
      activeUsers: 125,
      totalMessages: 1234,
      averageResponseTime: 2.5,
      lastMonthGrowth: 15,
      messagesByDay: [
        { date: '2024-03-01', count: 42 },
        { date: '2024-03-02', count: 58 },
        { date: '2024-03-03', count: 35 }
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{companyData.name}のダッシュボード</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">アクティブユーザー</h2>
              <p className="text-3xl font-bold text-indigo-600">{companyData.stats.activeUsers}</p>
              <p className="text-sm text-gray-500 mt-2">前月比 +{companyData.stats.lastMonthGrowth}%</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">総メッセージ数</h2>
              <p className="text-3xl font-bold text-indigo-600">{companyData.stats.totalMessages}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">平均応答時間</h2>
              <p className="text-3xl font-bold text-indigo-600">{companyData.stats.averageResponseTime}時間</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyDashboard;
