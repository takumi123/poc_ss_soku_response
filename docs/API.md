# API設計

## 1. 認証API

### 1.1 ログインAPI
- エンドポイント: POST /api/v1/login
- 説明: 管理者アカウントでのログイン認証を行う
- バッチ実行: なし
- リクエストボディ:
  ```json
  {
    "email": "string", 
    "password": "string"
  }
  ```
- レスポンス:
  ```json
  {
    "access_token": "string",
    "token_type": "Bearer"
  }
  ```

## 2. 会社管理API

### 2.1 会社情報登録API
- エンドポイント: POST /api/v1/companies
- 説明: 新規会社の登録を行う
- バッチ実行: なし
- リクエストボディ:
  ```json
  {
    "name": "string",
    "chatwork_api_key": "string"
  }
  ```

### 2.2 会社情報取得API 
- エンドポイント: GET /api/v1/companies/{company_id}
- 説明: 登録済み会社の情報を取得する
- バッチ実行: なし

## 3. ルーム管理API

### 3.1 ルーム一覧取得API
- エンドポイント: GET /api/v1/companies/{company_id}/rooms
- 説明: 監視対象ルームの一覧を取得する
- バッチ実行: あり（1会社5分に1回、300回まで）

### 3.2 ルーム設定更新API
- エンドポイント: PUT /api/v1/rooms/{room_id}
- 説明: ルームごとのリマインド設定を更新する
- バッチ実行: なし
- リクエストボディ:
  ```json
  {
    "remind_interval": 180 // 分単位 (30/60/180)
  }
  ```

## 4. メッセージ管理API

### 4.1 未返信メッセージ取得API
- エンドポイント: GET /api/v1/companies/{company_id}/unreplied_messages
- 説明: リマインド対象の未返信メッセージを取得する
- バッチ実行: あり（1会社5分に1回、300回まで）
- クエリパラメータ:
  - account_id: 対象ユーザーID
  - room_id: 対象ルームID

### 4.2 メッセージ状態更新API
- エンドポイント: PUT /api/v1/messages/{message_id}/status
- 説明: メッセージの返信状態を更新する
- バッチ実行: あり（1会社5分に1回、300回まで）
- リクエストボディ:
  ```json
  {
    "status": "REPLIED" // UNREPLIED/REPLIED
  }
  ```

## 5. リマインド管理API

### 5.1 リマインド履歴取得API
- エンドポイント: GET /api/v1/companies/{company_id}/reminders
- 説明: リマインド送信履歴を取得する
- バッチ実行: なし
- クエリパラメータ:
  - start_date: 開始日
  - end_date: 終了日

### 5.2 リマインド送信API
- エンドポイント: POST /api/v1/reminders
- 説明: 指定メッセージに対するリマインドを送信する
- バッチ実行: あり（1会社5分に1回、300回まで）
- リクエストボディ:
  ```json
  {
    "message_id": "string",
    "account_id": "string"
  }
  ```

## 6. 統計API

### 6.1 レスポンス統計取得API
- エンドポイント: GET /api/v1/companies/{company_id}/statistics
- 説明: 返信時間等の統計情報を取得する
- バッチ実行: なし
- クエリパラメータ:
  - period: 集計期間(daily/weekly/monthly)
  - account_id: 対象ユーザーID（オプション）

## 注意事項

- 全APIは認証必須
- レスポンスには適切なHTTPステータスコードを設定
- エラーレスポンスは以下の形式で統一
  ```json
  {
    "error": {
      "code": "string",
      "message": "string"
    }
  }
  ```
- Chatwork APIの制限(5分/300回)に注意
- メッセージ取得は100件/回の制限あり
- バッチ実行のあるAPIは1会社あたり5分間に300回までの実行制限あり
