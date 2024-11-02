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
    const apiToken = process.env.CHATWORK_API_TOKEN;
    if (!apiToken) {
        return new Response(JSON.stringify({ error: 'APIトークンが見つかりません' }), { status: 500 });
    }

    const roomId = '304374174';

    const url = `https://api.chatwork.com/v2/rooms/${roomId}/messages?force=1`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-ChatWorkToken': apiToken,
        },
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'チャットメッセージの取得に失敗しました' }), { status: response.status });
    }

    const rawData = await response.json() as ChatworkMessage[];
    const messages = rawData.map((_ChatworkMessage: ChatworkMessage) => ({
        message_id: _ChatworkMessage.message_id,
        account: {
            account_id: _ChatworkMessage.account.account_id,
            name: _ChatworkMessage.account.name
        },
        body: _ChatworkMessage.body,
        send_time: _ChatworkMessage.send_time
    }));

    return new Response(JSON.stringify({ messages }), { status: 200 });
}
