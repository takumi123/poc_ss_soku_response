# API設計

## APIエンドポイント一覧

### 認証系API
#### POST /api/auth/login
ログイン認証を行うAPI
- リクエストボディ
  - email: string (メールアドレス)
  - password: string (パスワード)
- レスポンス
  - token: string (JWTトークン)
  - user: Object (ユーザー情報)

#### POST /api/auth/register 
新規ユーザー登録API
- リクエストボディ
  - email: string (メールアドレス)
  - password: string (パスワード)
  - name: string (ユーザー名)
  - company_id: string (会社ID)
  - chatwork_id: string (ChatWorkユーザーID)
- レスポンス
  - user: Object (作成されたユーザー情報)

### ユーザー系API
#### GET /api/users/me
ログインユーザー情報取得API
- レスポンス
  - user: Object (ユーザー情報)

#### PUT /api/users/me/settings
ユーザー設定更新API
- リクエストボディ
  - default_remind_interval: number (デフォルトリマインド間隔)
  - notification_enabled: boolean (通知有効フラグ)
  - absence_start: string (不在開始日時)
  - absence_end: string (不在終了日時)
- レスポンス
  - settings: Object (更新された設定情報)

### メッセージ系API
#### GET /api/messages/unread
未返信メッセージ一覧取得API
- クエリパラメータ
  - page: number (ページ番号)
  - limit: number (1ページの件数)
- レスポンス
  - messages: Array (メッセージ一覧)
  - total: number (総件数)

#### POST /api/messages/analyze
メッセージ分析API
- リクエストボディ
  - content: string (メッセージ内容)
- レスポンス
  - urgency_level: number (緊急度)
  - importance_level: number (重要度)
  - remind_interval: number (推奨リマインド間隔)

### 統計系API
#### GET /api/stats/personal
個人の返信統計取得API
- クエリパラメータ
  - from: string (集計開始日)
  - to: string (集計終了日)
- レスポンス
  - average_response_time: number (平均返信時間)
  - response_count: number (返信数)
  - failed_response_count: number (即レス失敗数)

### 管理者系API
#### GET /api/admin/users
ユーザー一覧取得API
- クエリパラメータ
  - page: number (ページ番号)
  - limit: number (1ページの件数)
  - department_id: string (部署ID)
- レスポンス
  - users: Array (ユーザー一覧)
  - total: number (総件数)

#### GET /api/admin/stats/organization
組織全体の統計取得API
- クエリパラメータ
  - from: string (集計開始日)
  - to: string (集計終了日)
- レスポンス
  - department_stats: Array (部署別統計)
  - user_stats: Array (ユーザー別統計)
  - overall_stats: Object (全体統計)

### ChatWork連携API
#### POST /api/chatwork/webhook
ChatWorkからのWebhook受信API
- リクエストボディ
  - webhook_event: Object (Webhookイベント情報)
- レスポンス
  - status: string (処理結果)

#### POST /api/chatwork/remind
ChatWorkへのリマインド送信API
- リクエストボディ
  - room_id: string (ルームID)
  - user_id: string (ユーザーID)
  - message_id: string (元メッセージID)
  - message: string (送信メッセージ)
- レスポンス
  - status: string (送信結果)

#### POST /api/chatwork/message
ChatWorkへの一般メッセージ送信API
- リクエストボディ
  - room_id: string (ルームID)
  - message: string (送信メッセージ)
- レスポンス
  - message_id: string (送信されたメッセージID)
  - status: string (送信結果)

#### GET /api/chatwork/rooms
ユーザーが参加しているChatWorkルーム一覧取得API
- レスポンス
  - rooms: Array (ルーム一覧)
    - room_id: string (ルームID)
    - name: string (ルーム名)
    - type: string (ルーム種別)
    - role: string (ユーザーの権限)
