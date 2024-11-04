import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    // 各テーブルのデータを削除
    await prisma.messageRelation.deleteMany();
    await prisma.reminder.deleteMany(); 
    await prisma.message.deleteMany();
    await prisma.account.deleteMany();
    await prisma.room.deleteMany();

    return new Response(JSON.stringify({ message: 'データの削除が完了しました' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('データ削除中にエラーが発生しました:', error);
    return new Response(JSON.stringify({ error: 'データの削除に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
