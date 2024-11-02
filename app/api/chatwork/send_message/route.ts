export async function POST() {
    const apiToken = process.env.CHATWORK_API_TOKEN;
    const roomId = 359316633;

    if (!apiToken) {
        return new Response(JSON.stringify({ error: 'APIトークンが見つかりません' }), { status: 500 });
    }

    const response = await fetch(`https://api.chatwork.com/v2/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
            'X-ChatWorkToken': apiToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'body=こんにちは、Chatwork APIからのメッセージです。'
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'メッセージの送信に失敗しました' }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ message: 'メッセージを送信しました', data }), { status: 200 });
}
