# データベース設計

## テーブル一覧

### companies (会社)
| カラム名 | 型 | NULL | キー | 説明 |
|----------|-----|------|------|------|
| id | BIGINT | NO | PK | 会社ID |
| name | VARCHAR(255) | NO | | 会社名 |
| chatwork_account_id | BIGINT | NO | | 管理者アカウントID |
| chatwork_account_name | VARCHAR(255) | NO | | 管理者アカウント名 |
| chatwork_api_key | VARCHAR(255) | NO | | ChatworkのAPIキー |
| created_at | TIMESTAMP | NO | | 作成日時 |
| updated_at | TIMESTAMP | NO | | 更新日時 |

### rooms (ルーム)
| カラム名 | 型 | NULL | キー | 説明 |
|----------|-----|------|------|------|
| chatwork_room_id | BIGINT | NO | PK | ChatworkのルームID |
| company_id | BIGINT | NO | FK | 会社ID |
| name | VARCHAR(255) | NO | | ルーム名 |
| remind_interval | INT | NO | | リマインド間隔(分) デフォルト180分 |
| created_at | TIMESTAMP | NO | | 作成日時 |
| updated_at | TIMESTAMP | NO | | 更新日時 |

### accounts (アカウント)
| カラム名 | 型 | NULL | キー | 説明 |
|----------|-----|------|------|------|
| chatwork_account_id | BIGINT | NO | PK | ChatworkのアカウントID |
| company_id | BIGINT | NO | FK | 会社ID |
| name | VARCHAR(255) | NO | | アカウント名 |
| created_at | TIMESTAMP | NO | | 作成日時 |
| updated_at | TIMESTAMP | NO | | 更新日時 |

### messages (メッセージ)
| カラム名 | 型 | NULL | キー | 説明 |
|----------|-----|------|------|------|
| chatwork_message_id | BIGINT | NO | PK | ChatworkのメッセージID |
| company_id | BIGINT | NO | FK | 会社ID |
| room_id | BIGINT | NO | FK | ルームID |
| chatwork_account_id | BIGINT | NO | FK | 送信者のアカウントID |
| body | TEXT | NO | | メッセージ本文 |
| send_time | TIMESTAMP | NO | | 送信時刻 |
| created_at | TIMESTAMP | NO | | 作成日時 |
| updated_at | TIMESTAMP | NO | | 更新日時 |

### message_relations (メッセージ関係)
| カラム名 | 型 | NULL | キー | 説明 |
|----------|-----|------|------|------|
| id | BIGINT | NO | PK | ID |
| company_id | BIGINT | NO | FK | 会社ID |
| chatwork_message_id | BIGINT | NO | FK | 対象メッセージID |
| related_account_id | BIGINT | NO | FK | 関連するアカウントID |
| related_chatwork_message_id | BIGINT | YES | FK | 返信先メッセージID |
| type | ENUM('TO','RE') | NO | | 関係タイプ |
| status | ENUM('UNREPLIED','REPLIED') | NO | | ステータス |
| created_at | TIMESTAMP | NO | | 作成日時 |
| updated_at | TIMESTAMP | NO | | 更新日時 |

### reminders (リマインド履歴)
| カラム名 | 型 | NULL | キー | 説明 |
|----------|-----|------|------|------|
| id | BIGINT | NO | PK | ID |
| company_id | BIGINT | NO | FK | 会社ID |
| message_relation_id | BIGINT | NO | FK | メッセージ関係ID |
| remind_time | TIMESTAMP | NO | | リマインド送信時刻 |
| status | ENUM('SCHEDULED','SENT') | NO | | ステータス |
| created_at | TIMESTAMP | NO | | 作成日時 |
| updated_at | TIMESTAMP | NO | | 更新日時 |
