'use server'

import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'
import prisma from '@/app/lib/prisma'
import DataTable from '@/app/components/client/DataTable'

export default async function CompanyUsers() {
  // 3時間前と5日前のタイムスタンプを計算
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const accounts = await prisma.account.findMany({
    where: {
      companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
    },
    orderBy: {
      name: 'desc'
    },
    include: {
      messageRelations: {
        where: {
          status: 'UNREAD',
          targetMessage: {
            sendTime: {
              lt: threeHoursAgo,
              gt: fiveDaysAgo
            }
          }
        }
      }
    }
  }).then(accounts => accounts.map(account => ({
    chatworkAccountId: account.chatworkAccountId,
    name: account.name,
    iconUrl: account.image_url || '',
    isMessageTarget: account.isMessageTarget,
    unreadCount: Math.floor(account.messageRelations.length / 2)
  })));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable data={accounts} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
