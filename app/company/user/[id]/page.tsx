'use server'

import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'
import prisma from '@/app/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

// 自分が送信したメッセージを取得
async function getSentMessages(accountId: string) {
  return await prisma.message.findMany({
    where: {
      chatworkAccountId: BigInt(accountId)
    },
    orderBy: {
      sendTime: 'desc'
    },
    take: 10
  });
}

// 自分宛のメッセージを取得
async function getReceivedMessages(accountId: string) {
  // 3時間前と5日前のタイムスタンプを計算
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  return await prisma.message.findMany({
    where: {
      body: {
        contains: `[To:${accountId}]`
      }
    },
    include: {
      messageRelations: {
        where: {
          relatedAccountId: BigInt(accountId)
        }
      }
    },
    orderBy: {
      sendTime: 'desc'
    },
    take: 10
  });
}

// メッセージの種類を判定する関数
function isToMessage(body: string): boolean {
  // [To:xxxxx]の形式を含むメッセージをToとして扱う
  return body.match(/\[To:[0-9]+\]/) !== null;
}

// メッセージの型定義
type Message = {
  sendTime: Date;
  messageRelations: Array<{
    status: string;
  }>;
};

// MessageRelation型を定義
type MessageRelation = {
  status: string;
};

// メッセージが未読かつ3時間以上5日以内かを判定する関数
function isUnreadAndInTimeRange(message: Message): boolean {
  const now = new Date();
  const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));
  const messageTime = new Date(message.sendTime);

  return message.messageRelations.some((relation: MessageRelation) => 
    relation.status === 'UNREAD' && 
    messageTime < threeHoursAgo && 
    messageTime > fiveDaysAgo
  );
}

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function UserDetail({ params }: Props) {
  const { id } = await params;

  // BigIntに変換してユーザー情報を取得
  const account = await prisma.account.findUnique({
    where: {
      chatworkAccountId: BigInt(id)
    }
  });

  // ユーザーが見つからない場合は404
  if (!account) {
    notFound();
  }

  const sentMessages = await getSentMessages(id);
  const receivedMessages = await getReceivedMessages(id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              {account.image_url && (
                <Image
                  src={account.image_url}
                  alt={account.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{account.name}</h1>
                <p className="text-gray-600">ID: {account.chatworkAccountId.toString()}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-700">
                即レスくんメッセージ送信対象: {account.isMessageTarget ? <strong>はい</strong> : <strong>いいえ</strong>}
              </p>
            </div>

            <details className="mt-8" open>
              <summary className="text-xl font-bold mb-4 cursor-pointer">受信メッセージ履歴</summary>
              <div className="space-y-4">
                {receivedMessages.map(message => (
                  <div 
                    key={message.chatworkMessageId.toString()} 
                    className={`p-4 rounded-lg ${isUnreadAndInTimeRange(message) ? 'bg-red-50' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${isToMessage(message.body) ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {isToMessage(message.body) ? 'To' : 'Rp'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {message.sendTime.toLocaleString('ja-JP')}
                        </span>
                      </div>
                      <a 
                        href={`https://www.chatwork.com/#!rid${message.roomId.toString()}-${message.chatworkMessageId.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Room ID: {message.roomId.toString()} / Message ID: {message.chatworkMessageId.toString()}
                      </a>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
                  </div>
                ))}
              </div>
            </details>

            <details className="mt-8">
              <summary className="text-xl font-bold mb-4 cursor-pointer">送信メッセージ履歴</summary>
              <div className="space-y-4">
                {sentMessages.map(message => (
                  <div key={message.chatworkMessageId.toString()} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${isToMessage(message.body) ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {isToMessage(message.body) ? 'To' : 'Rp'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {message.sendTime.toLocaleString('ja-JP')}
                        </span>
                      </div>
                      <a 
                        href={`https://www.chatwork.com/#!rid${message.roomId.toString()}-${message.chatworkMessageId.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Room ID: {message.roomId.toString()} / Message ID: {message.chatworkMessageId.toString()}
                      </a>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
