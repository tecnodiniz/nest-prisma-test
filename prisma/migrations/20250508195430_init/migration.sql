-- CreateEnum
CREATE TYPE "agent_status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "user_plan" AS ENUM ('BASIC', 'PREMIUM', 'PROFESSIONAL');

-- CreateTable
CREATE TABLE "agente_terreiros" (
    "id" UUID NOT NULL,
    "id_terreiro_role" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_terreiro" UUID NOT NULL,
    "status" "agent_status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "agente_terreiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alembic_version" (
    "version_num" VARCHAR(32) NOT NULL,

    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
);

-- CreateTable
CREATE TABLE "auth" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email" VARCHAR(255),
    "password_hash" TEXT,
    "google_id" VARCHAR(255),
    "avatar_url" TEXT,
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terreiro_roles" (
    "id" UUID NOT NULL,
    "position" VARCHAR(50),
    "description" TEXT,

    CONSTRAINT "terreiro_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terreiros" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "contact" VARCHAR(50),
    "opening_hours" TEXT,
    "history" TEXT,
    "leader" UUID NOT NULL,
    "infrastructure" TEXT,
    "segment" VARCHAR(100),

    CONSTRAINT "terreiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "cpf" VARCHAR(14),
    "plan" "user_plan" NOT NULL,
    "contact" VARCHAR(15),
    "bio" VARCHAR(255),
    "profile_picture" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_terreiro" ON "agente_terreiros"("id_user", "id_terreiro");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key" ON "auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"("email");

-- CreateIndex
CREATE INDEX "ix_auth_id" ON "auth"("id");

-- CreateIndex
CREATE INDEX "ix_terreiro_roles_id" ON "terreiro_roles"("id");

-- CreateIndex
CREATE INDEX "ix_terreiros_id" ON "terreiros"("id");

-- CreateIndex
CREATE INDEX "ix_terreiros_name" ON "terreiros"("name");

-- CreateIndex
CREATE INDEX "ix_users_id" ON "users"("id");

-- CreateIndex
CREATE INDEX "ix_users_name" ON "users"("name");

-- AddForeignKey
ALTER TABLE "agente_terreiros" ADD CONSTRAINT "agente_terreiros_id_terreiro_fkey" FOREIGN KEY ("id_terreiro") REFERENCES "terreiros"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agente_terreiros" ADD CONSTRAINT "agente_terreiros_id_terreiro_role_fkey" FOREIGN KEY ("id_terreiro_role") REFERENCES "terreiro_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agente_terreiros" ADD CONSTRAINT "agente_terreiros_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "terreiros" ADD CONSTRAINT "terreiros_leader_fkey" FOREIGN KEY ("leader") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
