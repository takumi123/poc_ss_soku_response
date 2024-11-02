# DB設計




## テーブル一覧

### 1. usersテーブル
ユーザー情報を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | ユーザーID |
| email | varchar(255) | NO | UQ | メールアドレス |
| password_hash | varchar(255) | NO | - | パスワードハッシュ |
| name | varchar(100) | NO | - | ユーザー名 |
| role | enum | NO | - | 権限(user/admin/company_admin) |
| company_id | uuid | NO | FK | 所属会社ID |
| department_id | uuid | YES | FK | 所属部署ID |
| chatwork_id | varchar(100) | NO | UQ | ChatWorkユーザーID |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |
| deleted_at | timestamp | YES | - | 削除日時 |

### 2. companiesテーブル
会社情報を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | 会社ID |
| name | varchar(100) | NO | - | 会社名 |
| business_hours_start | time | NO | - | 営業開始時間 |
| business_hours_end | time | NO | - | 営業終了時間 |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |
| deleted_at | timestamp | YES | - | 削除日時 |

### 3. departmentsテーブル
部署情報を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | 部署ID |
| company_id | uuid | NO | FK | 会社ID |
| name | varchar(100) | NO | - | 部署名 |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |
| deleted_at | timestamp | YES | - | 削除日時 |

### 4. messagesテーブル
ChatWorkメッセージを管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | メッセージID |
| chatwork_message_id | varchar(100) | NO | UQ | ChatWorkメッセージID |
| room_id | uuid | NO | FK | ルームID |
| sender_id | uuid | NO | FK | 送信者ID |
| content | text | NO | - | メッセージ内容 |
| to_users | uuid[] | YES | - | To指定ユーザーID配列 |
| re_users | uuid[] | YES | - | Re指定ユーザーID配列 |
| urgency_level | int | NO | - | 緊急度(1-5) |
| importance_level | int | NO | - | 重要度(1-5) |
| remind_interval | int | NO | - | リマインド間隔(分) |
| created_at | timestamp | NO | - | 作成日時 |
| deleted_at | timestamp | YES | - | 削除日時 |

### 5. roomsテーブル
ChatWorkルーム情報を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | ルームID |
| chatwork_room_id | varchar(100) | NO | UQ | ChatWorkルームID |
| company_id | uuid | NO | FK | 会社ID |
| name | varchar(100) | NO | - | ルーム名 |
| is_enabled | boolean | NO | - | 即レスくん有効フラグ |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |
| deleted_at | timestamp | YES | - | 削除日時 |

### 6. responsesテーブル
メッセージへの返信情報を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | 返信ID |
| message_id | uuid | NO | FK | 元メッセージID |
| responder_id | uuid | NO | FK | 返信者ID |
| response_time | interval | NO | - | 返信までの時間 |
| is_within_time | boolean | NO | - | 期限内返信フラグ |
| created_at | timestamp | NO | - | 作成日時 |

### 7. remindsテーブル
リマインド履歴を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | リマインドID |
| message_id | uuid | NO | FK | メッセージID |
| user_id | uuid | NO | FK | リマインド対象ユーザーID |
| status | enum | NO | - | ステータス(pending/sent/cancelled) |
| scheduled_at | timestamp | NO | - | 予定日時 |
| sent_at | timestamp | YES | - | 送信日時 |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |

### 8. user_settingsテーブル
ユーザー個別設定を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | 設定ID |
| user_id | uuid | NO | FK,UQ | ユーザーID |
| default_remind_interval | int | NO | - | デフォルトリマインド間隔(分) |
| notification_enabled | boolean | NO | - | 通知有効フラグ |
| absence_start | timestamp | YES | - | 不在開始日時 |
| absence_end | timestamp | YES | - | 不在終了日時 |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |

### 9. department_chatwork_settingsテーブル
部署ごとのChatWork設定を管理するテーブル

| カラム名 | 型 | NULL | キー | 説明 |
|---------|-----|------|------|------|
| id | uuid | NO | PK | 設定ID |
| department_id | uuid | NO | FK,UQ | 部署ID |
| chatwork_api_token | varchar(255) | NO | - | ChatWork APIトークン |
| bot_name | varchar(100) | NO | - | 送信BOT名 |
| created_at | timestamp | NO | - | 作成日時 |
| updated_at | timestamp | NO | - | 更新日時 |

