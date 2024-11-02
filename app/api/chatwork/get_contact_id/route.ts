interface ChatworkContact {
    account_id: number;
    room_id: number;
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

    const url = 'https://api.chatwork.com/v2/contacts';
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-ChatWorkToken': apiToken,
        },
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'コンタクト情報の取得に失敗しました' }), { status: response.status });
    }

    const contacts = await response.json() as ChatworkContact[];

    return new Response(JSON.stringify({ contacts }), { status: 200 });
}
