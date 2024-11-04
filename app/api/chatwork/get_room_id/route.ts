    import prisma from '@/app/lib/prisma';

    interface ChatworkRoom {
        room_id: number;
        name: string;
        type: string;
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

            const response = await fetch('https://api.chatwork.com/v2/rooms', {
                method: 'GET',
                headers: {
                    'X-ChatWorkToken': company.chatworkApiKey,
                },
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'チャットワークのルーム取得に失敗しました' }), { status: response.status });
            }

            const rawData = await response.json() as ChatworkRoom[];

            // 取得したルーム情報をDBに保存
            for (const room of rawData) {
                await prisma.room.upsert({
                    where: {
                        chatworkRoomId: BigInt(room.room_id)
                    },
                    update: {
                        name: room.name
                    },
                    create: {
                        chatworkRoomId: BigInt(room.room_id),
                        name: room.name,
                        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
                    }
                });
            }

            const data = rawData.map((room) => ({
                room_id: room.room_id,
                name: room.name,
                type: room.type
            }));

            return new Response(JSON.stringify({ rooms: data }), { status: 200 });

        } catch (error) {
            console.error('Error:', error);
            return new Response(JSON.stringify({ error: 'サーバーエラーが発生しました' }), { status: 500 });
        }
    }
