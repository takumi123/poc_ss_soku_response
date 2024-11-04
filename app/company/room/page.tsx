'use server'

import prisma from '@/app/lib/prisma'
import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'
import Link from 'next/link'

async function getRooms() {
  try {
    // 3時間前と5日前のタイムスタンプを計算
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const rooms = await prisma.room.findMany({
      where: {
        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
      },
      select: {
        chatworkRoomId: true,
        name: true,
        remindInterval: true,
        messages: {
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
        }
      }
    })

    return rooms.map(room => ({
      ...room,
      unreadCount: Math.floor(room.messages.reduce((acc, message) => 
        acc + message.messageRelations.length, 0) / 2)
    }))
  } catch (error) {
    console.error('Error:', error)
    throw new Error('ルーム情報の取得に失敗しました')
  }
}

export default async function CompanyRooms() {
  const rooms = await getRooms()

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
                    リマインド間隔(分)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    返信必要数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.chatworkRoomId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/company/chat/${room.chatworkRoomId}`} className="text-indigo-600 hover:text-indigo-900">
                        {room.chatworkRoomId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/company/chat/${room.chatworkRoomId}`} className="text-indigo-600 hover:text-indigo-900">
                        {room.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.remindInterval || '未設定'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={room.unreadCount > 0 ? "text-red-600 font-bold" : "text-gray-500"}>
                        {room.unreadCount > 0 ? room.unreadCount : '-'}
                      </span>
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
  )
}
