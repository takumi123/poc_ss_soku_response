-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "chatwork_account_id" BIGINT,
    "chatwork_account_name" VARCHAR(255),
    "chatwork_api_key" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "chatwork_room_id" BIGINT NOT NULL,
    "company_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "remind_interval" INTEGER NOT NULL DEFAULT 180,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("chatwork_room_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "chatwork_account_id" BIGINT NOT NULL,
    "company_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("chatwork_account_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "chatwork_message_id" BIGINT NOT NULL,
    "company_id" UUID NOT NULL,
    "room_id" BIGINT NOT NULL,
    "chatwork_account_id" BIGINT NOT NULL,
    "body" TEXT NOT NULL,
    "send_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("chatwork_message_id")
);

-- CreateTable
CREATE TABLE "message_relations" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "chatwork_message_id" BIGINT NOT NULL,
    "related_account_id" BIGINT NOT NULL,
    "related_chatwork_message_id" BIGINT,
    "type" VARCHAR(2) NOT NULL,
    "status" VARCHAR(9) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "message_relation_id" UUID NOT NULL,
    "remind_time" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(9) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("chatwork_room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatwork_account_id_fkey" FOREIGN KEY ("chatwork_account_id") REFERENCES "accounts"("chatwork_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_relations" ADD CONSTRAINT "message_relations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_relations" ADD CONSTRAINT "message_relations_chatwork_message_id_fkey" FOREIGN KEY ("chatwork_message_id") REFERENCES "messages"("chatwork_message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_relations" ADD CONSTRAINT "message_relations_related_account_id_fkey" FOREIGN KEY ("related_account_id") REFERENCES "accounts"("chatwork_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_relations" ADD CONSTRAINT "message_relations_related_chatwork_message_id_fkey" FOREIGN KEY ("related_chatwork_message_id") REFERENCES "messages"("chatwork_message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_message_relation_id_fkey" FOREIGN KEY ("message_relation_id") REFERENCES "message_relations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
