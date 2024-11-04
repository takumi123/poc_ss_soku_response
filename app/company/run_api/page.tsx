'use server'

import Header from '@/app/components/header'
import Sidebar from '@/app/components/sidebar'
import Footer from '@/app/components/footer'

export default async function RunApi() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">API実行ページ</h1>
            
            <div className="space-y-4">
            <div className="p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">チャットワークルーム取得</h2>
                <p className="text-gray-600 mb-4">チャットワークのルーム取得します</p>
                <a 
                  href="/api/chatwork/get_room_id"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API実行
                </a>
              </div>
              <div className="p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">チャットワークルームメッセージ取得</h2>
                <p className="text-gray-600 mb-4">チャットワークのルームメッセージを取得します</p>
                <a 
                  href="/api/chatwork/get_room_chat"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API実行
                </a>
              </div>

              <div className="p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">ルームメンバーID取得</h2>
                <p className="text-gray-600 mb-4">チャットワークルームのメンバーIDを取得します</p>
                <a
                  href="/api/chatwork/get_account_id_from_room"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API実行
                </a>
              </div>

              <div className="p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">メッセージデータ振り分け</h2>
                <p className="text-gray-600 mb-4">メッセージデータを振り分けます</p>
                <a
                  href="/api/chatwork/set_reminder_chat"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API実行
                </a>
              </div>

              <div className="p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">companyデータ以外削除</h2>
                <p className="text-gray-600 mb-4">APIキーを更新した際に利用。companyデータ以外削除</p>
                <a
                  href="/api/chatwork/delete_data"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  companyデータ以外削除
                </a>
              </div>


            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
