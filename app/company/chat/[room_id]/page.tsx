'use server'

import prisma from '@/app/lib/prisma'
import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'
import Link from 'next/link'

async function getMessages(roomId: string) {
  try {
    // 3時間前と5日前のタイムスタンプを計算
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const messages = await prisma.message.findMany({
      where: {
        roomId: BigInt(roomId)
      },
      include: {
        account: true,
        messageRelations: {
          where: {
            status: 'UNREAD',
            targetMessage: {
              sendTime: {
                lt: threeHoursAgo,
                gt: fiveDaysAgo
              }
            }
          },
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

type Params = Promise<{ room_id: string }>

// メッセージの型定義
type MessageRelation = {
  status: string;
  relatedAccount: {
    chatworkAccountId: string | number | bigint;
    name: string;
  };
  relatedMessage: {
    chatworkMessageId: bigint;
    roomId: bigint;
    body: string;
    sendTime: Date;
  } | null;
};

type Message = {
  chatworkMessageId: bigint;
  sendTime: Date;
  body: string;
  account: {
    chatworkAccountId: bigint;
    name: string;
  };
  messageRelations: MessageRelation[];
}

export default async function ChatRoom({
  params
}: {
  params: Params
}) {
  const resolvedParams = await params
  const { room_id } = resolvedParams
  const messages = await getMessages(room_id)

  // メッセージが未読かつ3時間以上5日以内かを判定する関数
  const isUnreadAndInTimeRange = (message: Message) => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));
    const messageTime = new Date(message.sendTime);

    return message.messageRelations.length > 0 && 
      messageTime < threeHoursAgo && 
      messageTime > fiveDaysAgo;
  };

  // 未読メッセージの数をカウント
  const unreadCount = messages.filter(isUnreadAndInTimeRange).length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">チャットルーム</h1>
            <div className="text-red-600 font-bold">
              未返信メッセージ: {unreadCount}件
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={String(message.chatworkMessageId)} 
                  className={`border-b ${isUnreadAndInTimeRange(message) ? 'bg-red-50' : 'bg-white'} p-6`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/company/user/${message.account.chatworkAccountId.toString()}`}
                        className="text-indigo-600 hover:text-indigo-900 hover:underline font-medium"
                      >
                        {message.account.name}
                      </Link>
                      <span className="text-gray-500 text-sm">
                        {message.sendTime.toLocaleString()}
                      </span>
                    </div>
                    <a 
                      href={`https://www.chatwork.com/#!rid${room_id}-${message.chatworkMessageId.toString()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 hover:underline text-sm"
                    >
                      チャットワークで開く
                    </a>
                  </div>

                  <p className="text-gray-900 whitespace-pre-wrap mb-4">{message.body}</p>

                  {message.messageRelations.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">
                        メンション: {Array.from(new Set(message.messageRelations.map(relation => 
                          relation.relatedAccount.chatworkAccountId.toString()
                        ))).map((accountId, index) => {
                          const relation = message.messageRelations.find(r => 
                            r.relatedAccount.chatworkAccountId.toString() === accountId
                          );
                          return (
                            <>
                              {index > 0 && ', '}
                              <Link 
                                key={accountId}
                                href={`/company/user/${accountId}`}
                                className="text-indigo-600 hover:text-indigo-900 hover:underline"
                              >
                                {relation?.relatedAccount.name}
                              </Link>
                            </>
                          );
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center py-6 text-gray-500">
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
