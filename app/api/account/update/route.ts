import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function POST(request: Request) {
  try {
    const { accountId, isMessageTarget } = await request.json()

    // BigIntに変換
    const chatworkAccountId = BigInt(accountId)

    // アカウントの更新
    const updatedAccount = await prisma.account.update({
      where: {
        chatworkAccountId: chatworkAccountId
      },
      data: {
        isMessageTarget: isMessageTarget
      }
    })

    // 更新が成功した場合は200ステータスコードを返す
    return NextResponse.json(
      { message: '更新に成功しました', account: updatedAccount },
      { status: 200 }
    )

  } catch (error) {
    console.error('エラーが発生しました:', error)
    
    // エラーの種類に応じて適切なステータスコードとメッセージを返す
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
}
