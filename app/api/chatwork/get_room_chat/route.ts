import prisma from '@/app/lib/prisma';

interface ChatworkMessage {
    message_id: string;
    account: {
        account_id: number;
        name: string;
    };
    body: string;
    send_time: number;
}

export async function GET() {
    try {
        // DBからAPIキーを取得
        const company = await prisma.company.findUnique({
            where: {
                id: '2ca606b2-56c7-481d-89c2-187b5147f485'
            },
            select: {
                chatworkApiKey: true
            }
        });

        if (!company?.chatworkApiKey) {
            return new Response(JSON.stringify({ error: 'APIキーが設定されていません' }), { status: 500 });
        }

        // DBからルーム一覧を取得
        const rooms = await prisma.room.findMany({
            where: {
                companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
            }
        });

        for (const room of rooms) {
            const url = `https://api.chatwork.com/v2/rooms/${room.chatworkRoomId}/messages?force=1`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-ChatWorkToken': company.chatworkApiKey,
                },
            });

            if (!response.ok) {
                console.error(`Room ${room.chatworkRoomId} のメッセージ取得に失敗: ${response.status}`);
                continue;
            }

            const rawData = await response.json() as ChatworkMessage[];

            // メッセージをDBに保存
            for (const message of rawData) {
                // アカウント情報を保存/更新
                await prisma.account.upsert({
                    where: {
                        chatworkAccountId: BigInt(message.account.account_id)
                    },
                    update: {
                        name: message.account.name
                    },
                    create: {
                        chatworkAccountId: BigInt(message.account.account_id),
                        name: message.account.name,
                        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
                    }
                });

                // メッセージを保存
                await prisma.message.upsert({
                    where: {
                        chatworkMessageId: BigInt(message.message_id)
                    },
                    update: {
                        body: message.body,
                        sendTime: new Date(message.send_time * 1000)
                    },
                    create: {
                        chatworkMessageId: BigInt(message.message_id),
                        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485',
                        roomId: room.chatworkRoomId,
                        chatworkAccountId: BigInt(message.account.account_id),
                        body: message.body,
                        sendTime: new Date(message.send_time * 1000)
                    }
                });
            }
        }

        return new Response(JSON.stringify({ message: 'メッセージの同期が完了しました' }), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'サーバーエラーが発生しました' }), { status: 500 });
    }
}
