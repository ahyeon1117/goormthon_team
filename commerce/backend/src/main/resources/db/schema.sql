CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR(100) PRIMARY KEY,
  "password" VARCHAR(100) NOT NULL,
  "nick_name" VARCHAR(100) NOT NULL,
  "role" BIGINT NOT NULL, -- ADMIN(99), USER(1)
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" BIGSERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "link" VARCHAR(255) NOT NULL,
  "image" VARCHAR(255) NOT NULL,
  "author" VARCHAR(255) NOT NULL,
  "discount" DECIMAL(10,2) NOT NULL,
  "publisher" VARCHAR(255) NOT NULL,
  "pubdate" VARCHAR(255) NOT NULL,
  "isbn" VARCHAR(255) NOT NULL UNIQUE,
  "description" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_product_title" ON "products" ("title");
CREATE INDEX IF NOT EXISTS "idx_product_author" ON "products" ("author");
CREATE INDEX IF NOT EXISTS "idx_product_publisher" ON "products" ("publisher");
CREATE INDEX IF NOT EXISTS "idx_product_search" ON "products" ("title", "author", "publisher");

CREATE TABLE IF NOT EXISTS "orders" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" VARCHAR(100) NOT NULL,
  "total_price" DECIMAL(10,2) NOT NULL,
  "status" BIGINT NOT NULL, -- PENDING(1), COMPLETED(2), CANCELLED(3), REFUNDED(5)
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_user_id_fkey FOREIGN KEY ("user_id")
    REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_order_user" ON "orders" ("user_id");

CREATE TABLE IF NOT EXISTS "inventories" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" VARCHAR(100) NOT NULL UNIQUE,
  "items_count" BIGINT NOT NULL DEFAULT 0, -- 보유한 전자책 개수
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT inventories_user_id_fkey FOREIGN KEY ("user_id")
    REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "carts" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" VARCHAR(100) NOT NULL UNIQUE,
  "items_count" BIGINT NOT NULL DEFAULT 0, -- 장바구니에 담긴 상품 개수
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT carts_user_id_fkey FOREIGN KEY ("user_id")
    REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "order_id" BIGINT NOT NULL,
  "product_id" BIGINT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY ("order_id")
    REFERENCES "orders" ("id") ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "products" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_order_item_order_product" ON "order_items" ("order_id", "product_id");

CREATE TABLE IF NOT EXISTS "inventory_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "inventory_id" BIGINT NOT NULL,
  "product_id" BIGINT NOT NULL,
  "order_item_id" BIGINT,
  "last_accessed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT inventory_items_inventory_id_fkey FOREIGN KEY ("inventory_id")
    REFERENCES "inventories" ("id") ON DELETE CASCADE,
  CONSTRAINT inventory_items_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT inventory_items_order_item_id_fkey FOREIGN KEY ("order_item_id")
    REFERENCES "order_items" ("id") ON DELETE CASCADE,
  CONSTRAINT inventory_product_unique UNIQUE ("inventory_id", "product_id")
);

CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "cart_id" BIGINT NOT NULL,
  "product_id" BIGINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY ("cart_id")
    REFERENCES "carts" ("id") ON DELETE CASCADE,
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT cart_product_unique UNIQUE ("cart_id", "product_id")
);

CREATE TABLE IF NOT EXISTS "wishes" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" VARCHAR(100) NOT NULL,
  "product_id" BIGINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT wishes_user_id_fkey FOREIGN KEY ("user_id")
    REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT wishes_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT user_product_wish_unique UNIQUE ("user_id", "product_id")
);

CREATE INDEX IF NOT EXISTS "idx_wish_product" ON "wishes" ("product_id");

CREATE TABLE IF NOT EXISTS "payments" (
  "id" BIGSERIAL PRIMARY KEY,
  "order_id" BIGINT NOT NULL UNIQUE,
  "payment_method" VARCHAR(50) NOT NULL,
  "status" BIGINT NOT NULL, -- PENDING(1), COMPLETED(2), FAILED(4), REFUNDED(5)
  "transaction_id" VARCHAR(255) UNIQUE NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "payment_date" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payments_order_id_fkey FOREIGN KEY ("order_id")
    REFERENCES "orders" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" VARCHAR(100) NOT NULL,
  "product_id" BIGINT NOT NULL,
  "rating" BIGINT NOT NULL, -- 1-5 평점
  "title" VARCHAR(255),
  "message" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY ("user_id")
    REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT user_product_review_unique UNIQUE ("user_id", "product_id")
);
