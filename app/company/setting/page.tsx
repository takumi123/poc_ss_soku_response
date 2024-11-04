'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/app/lib/prisma'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer' 
import Sidebar from '@/app/components/sidebar'

async function getApiKey() {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: '2ca606b2-56c7-481d-89c2-187b5147f485'
      },
      select: {
        chatworkApiKey: true
      }
    })
    return company?.chatworkApiKey || ''
  } catch (error) {
    console.error('Error:', error)
    throw new Error('APIキーの取得に失敗しました')
  }
}
async function updateApiKey(formData: FormData) {
  'use server'
  
  const apiKey = formData.get('apiKey') as string
  
  try {
    await prisma.company.update({
      where: {
        id: '2ca606b2-56c7-481d-89c2-187b5147f485'
      },
      data: {
        chatworkApiKey: apiKey
      }
    })
    revalidatePath('/company')
    return { success: true, message: '更新が完了しました' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: '更新に失敗しました' }
  }
}

// フォームハンドラーを別の関数として定義
async function handleFormAction(formData: FormData): Promise<void> {
  'use server'
  const result = await updateApiKey(formData)
  if (!result.success) {
    throw new Error(result.error)
  }

}

export default async function CompanySettingPage() {
  const apiKey = await getApiKey()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">会社設定</h1>
            
            <form 
              action={handleFormAction}
              className="space-y-4"
            >
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  Chatwork API キー
                </label>
                <input
                  type="text"
                  id="apiKey"
                  name="apiKey"
                  defaultValue={apiKey}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Chatwork API キーを入力してください"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  更新
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
