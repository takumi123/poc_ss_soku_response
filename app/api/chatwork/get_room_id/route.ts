    // Start Generation Here
    interface ChatworkRoom {
        room_id: number;
        name: string;
        type: string;
    }

    export async function GET() {
        const apiToken = process.env.CHATWORK_API_TOKEN;
        if (!apiToken) {
            return new Response(JSON.stringify({ error: 'APIトークンが見つかりません' }), { status: 500 });
        }

        const response = await fetch('https://api.chatwork.com/v2/rooms', {
            method: 'GET',
            headers: {
                'X-ChatWorkToken': apiToken,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'チャットワークのルーム取得に失敗しました' }), { status: response.status });
        }
        const rawData = await response.json() as ChatworkRoom[];
        const data = rawData.map((_ChatworkRoom: ChatworkRoom) => ({
            room_id: _ChatworkRoom.room_id,
            name: _ChatworkRoom.name,
            type: _ChatworkRoom.type
        }));
        return new Response(JSON.stringify({ rooms: data }), { status: 200 });
    }
