'use server'

import prisma from '@/app/lib/prisma'
import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'

type PageProps = {
  params: {
    room_id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

async function getMessages(roomId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        roomId: BigInt(roomId)
      },
      include: {
        account: true,
        messageRelations: {
          include: {
            relatedAccount: true,
            relatedMessage: true
          }
        }
      },
      orderBy: {
        sendTime: 'desc'
      }
    })
    return messages
  } catch (error) {
    console.error('Error:', error)
    throw new Error('メッセージの取得に失敗しました')
  }
}

export default async function ChatRoom({ params }: PageProps) {
  const { room_id } = params
  const messages = await getMessages(room_id)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">チャットルーム</h1>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={String(message.chatworkMessageId)} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <span className="font-bold">{message.account.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {message.sendTime.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
                  {message.messageRelations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        メンション: {message.messageRelations.map(relation => 
                          relation.relatedAccount.name
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  メッセージが見つかりませんでした
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
