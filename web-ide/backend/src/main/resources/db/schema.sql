-- users 테이블
CREATE TABLE IF NOT EXISTS "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" VARCHAR(50) NOT NULL,
  "email" VARCHAR(100) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- projects 테이블
CREATE TABLE IF NOT EXISTS "projects" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "owner_id" BIGINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") 
    REFERENCES "users" ("id") ON DELETE CASCADE
);

-- project_members 테이블
CREATE TABLE IF NOT EXISTS "project_members" (
  "id" BIGSERIAL PRIMARY KEY,
  "project_id" BIGINT NOT NULL,
  "user_id" BIGINT NOT NULL,
  "joined_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") 
    REFERENCES "projects" ("id") ON DELETE CASCADE,
  CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") 
    REFERENCES "users" ("id") ON DELETE CASCADE
);

-- folders 테이블
CREATE TABLE IF NOT EXISTS "folders" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "parent_id" BIGINT,
  "project_id" BIGINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- CONSTRAINT "folders_parent_id_fkey" FOREIGN KEY ("parent_id") 
  --   REFERENCES "folders" ("id") ON DELETE CASCADE,
  CONSTRAINT "folders_project_id_fkey" FOREIGN KEY ("project_id") 
    REFERENCES "projects" ("id") ON DELETE CASCADE
);

-- files 테이블
CREATE TABLE IF NOT EXISTS "files" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "content" TEXT,
  "folder_id" BIGINT NOT NULL,
  "project_id" BIGINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "files_folder_id_fkey" FOREIGN KEY ("folder_id") 
    REFERENCES "folders" ("id") ON DELETE CASCADE,
  CONSTRAINT "files_project_id_fkey" FOREIGN KEY ("project_id") 
    REFERENCES "projects" ("id") ON DELETE CASCADE
);

-- chat_rooms 테이블
CREATE TABLE IF NOT EXISTS "chat_rooms" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "project_id" BIGINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "chat_rooms_project_id_fkey" FOREIGN KEY ("project_id") 
    REFERENCES "projects" ("id") ON DELETE CASCADE
);

-- messages 테이블
CREATE TABLE IF NOT EXISTS "messages" (
  "id" BIGSERIAL PRIMARY KEY,
  "chatroom_id" BIGINT NOT NULL,
  "user_id" BIGINT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "messages_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") 
    REFERENCES "chat_rooms" ("id") ON DELETE CASCADE,
  CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") 
    REFERENCES "users" ("id") ON DELETE CASCADE
);