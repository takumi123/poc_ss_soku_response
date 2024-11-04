import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    // 既存のメッセージリレーションを全て削除
    await prisma.messageRelation.deleteMany({
      where: {
        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
      }
    });

    // メッセージデータを取得
    const messages = await prisma.message.findMany({
      where: {
        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
      },
      include: {
        account: true
      },
      orderBy: {
        sendTime: 'asc'
      }
    });

    for (const message of messages) {
      // メッセージ本文からメンション対象を抽出
      const mentionMatches = message.body.match(/\[To:(\d+)\]/g);
      const replyMatches = message.body.match(/\[rp aid=(\d+)\]/g);

      if (mentionMatches) {
        // メンション対象のアカウントIDを抽出
        const accountIds = mentionMatches.map(match => {
          const id = match.match(/\[To:(\d+)\]/);
          return id ? BigInt(id[1]) : null;
        }).filter((id): id is bigint => id !== null);

        // メンション対象ごとにメッセージリレーションを作成
        for (const accountId of accountIds) {
          // このメッセージに対する返信があるか確認
          const hasReply = await prisma.message.findFirst({
            where: {
              body: {
                contains: `[rp aid=${accountId}]`
              },
              companyId: message.companyId,
              sendTime: {
                gt: message.sendTime
              }
            }
          });

          // このメッセージ以降に同じアカウントからメッセージが送信されているか確認
          const hasSentMessage = await prisma.message.findFirst({
            where: {
              chatworkAccountId: accountId,
              companyId: message.companyId,
              sendTime: {
                gt: message.sendTime
              }
            }
          });

          await prisma.messageRelation.create({
            data: {
              companyId: message.companyId,
              chatworkMessageId: message.chatworkMessageId,
              relatedAccountId: accountId,
              type: 'TO',
              status: (hasReply || hasSentMessage) ? 'READ' : 'UNREAD'
            }
          });
        }
      }

      if (replyMatches) {
        // リプライ対象のアカウントIDを抽出
        const accountIds = replyMatches.map(match => {
          const id = match.match(/\[rp aid=(\d+)\]/);
          return id ? BigInt(id[1]) : null;
        }).filter((id): id is bigint => id !== null);

        // リプライ対象ごとにメッセージリレーションを作成
        for (const accountId of accountIds) {
          // このメッセージに対する返信があるか確認
          const hasReply = await prisma.message.findFirst({
            where: {
              body: {
                contains: `[rp aid=${accountId}]`
              },
              companyId: message.companyId,
              sendTime: {
                gt: message.sendTime
              }
            }
          });

          // このメッセージ以降に同じアカウントからメッセージが送信されているか確認
          const hasSentMessage = await prisma.message.findFirst({
            where: {
              chatworkAccountId: accountId,
              companyId: message.companyId,
              sendTime: {
                gt: message.sendTime
              }
            }
          });

          await prisma.messageRelation.create({
            data: {
              companyId: message.companyId,
              chatworkMessageId: message.chatworkMessageId,
              relatedAccountId: accountId,
              type: 'RP',
              status: (hasReply || hasSentMessage) ? 'READ' : 'UNREAD'
            }
          });
        }
      }
    }

    return new Response(JSON.stringify({ message: 'メッセージリレーションの作成が完了しました' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('メッセージリレーション作成中にエラーが発生しました:', error);
    return new Response(JSON.stringify({ error: 'メッセージリレーションの作成に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
