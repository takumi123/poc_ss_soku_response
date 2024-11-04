import prisma from '@/app/lib/prisma';

interface ChatworkMember {
    account_id: number;
    role: string;
    name: string;
    chatwork_id: string;
    organization_id: number;
    organization_name: string;
    department: string;
    avatar_image_url: string;
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
            const url = `https://api.chatwork.com/v2/rooms/${room.chatworkRoomId}/members`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-ChatWorkToken': company.chatworkApiKey,
                },
            });

            if (!response.ok) {
                console.error(`Room ${room.chatworkRoomId} のメンバー取得に失敗: ${response.status}`);
                continue;
            }

            const members = await response.json() as ChatworkMember[];

            // メンバー情報をDBに保存
            for (const member of members) {
                // nameが空の場合はスキップ
                if (!member.name) {
                    continue;
                }

                await prisma.account.upsert({
                    where: {
                        chatworkAccountId: BigInt(member.account_id)
                    },
                    update: {
                        name: member.name,
                        image_url: member.avatar_image_url
                    },
                    create: {
                        chatworkAccountId: BigInt(member.account_id),
                        name: member.name,
                        image_url: member.avatar_image_url,
                        companyId: '2ca606b2-56c7-481d-89c2-187b5147f485'
                    }
                });
            }
        }

        return new Response(JSON.stringify({ message: 'アカウント情報の同期が完了しました' }), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'サーバーエラーが発生しました' }), { status: 500 });
    }
}
