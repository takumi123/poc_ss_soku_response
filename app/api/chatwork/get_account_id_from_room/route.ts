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
    const apiToken = process.env.CHATWORK_API_TOKEN;
    if (!apiToken) {
        return new Response(JSON.stringify({ error: 'APIトークンが見つかりません' }), { status: 500 });
    }

    const roomId = '352260678';

    const url = `https://api.chatwork.com/v2/rooms/${roomId}/members`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-ChatWorkToken': apiToken,
        },
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'メンバー情報の取得に失敗しました' }), { status: response.status });
    }

    const members = await response.json() as ChatworkMember[];

    return new Response(JSON.stringify({ members }), { status: 200 });
}
