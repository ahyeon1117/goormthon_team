CREATE TABLE IF NOT EXISTS "member" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "phone_number" VARCHAR(20),
  "role" VARCHAR(20),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "product" (
  "title" VARCHAR(255) PRIMARY KEY,
  "link" VARCHAR(255) NOT NULL,
  "image" VARCHAR(255) NOT NULL,
  "author" VARCHAR(255) NOT NULL,
  "discount" DECIMAL(10,2) NOT NULL,
  "publisher" VARCHAR(255) NOT NULL,
  "pubdate" VARCHAR(255) NOT NULL,
  "isbn" VARCHAR(255) NOT NULL,
  "description" TEXT
);

CREATE TABLE IF NOT EXISTS "inventory" (
  "id" SERIAL PRIMARY KEY,
  "product_id" VARCHAR(255) UNIQUE,
  "quantity_available" INT DEFAULT 0,
  "restock_date" TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT inventory_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "product" ("title") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ordersheet" (
  "id" SERIAL PRIMARY KEY,
  "member_id" INT,
  "total_price" DECIMAL(10,2) NOT NULL,
  "status" VARCHAR(20),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ordersheet_member_id_fkey FOREIGN KEY ("member_id")
    REFERENCES "member" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "order_item" (
  "id" SERIAL PRIMARY KEY,
  "ordersheet_id" INT,
  "product_id" VARCHAR(255),
  "quantity" INT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT order_item_ordersheet_id_fkey FOREIGN KEY ("ordersheet_id")
    REFERENCES "ordersheet" ("id") ON DELETE CASCADE,
  CONSTRAINT order_item_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "product" ("title") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "cart_item" (
  "id" SERIAL PRIMARY KEY,
  "member_id" INT,
  "product_id" VARCHAR(255),
  "quantity" INT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cart_item_member_id_fkey FOREIGN KEY ("member_id")
    REFERENCES "member" ("id") ON DELETE CASCADE,
  CONSTRAINT cart_item_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "product" ("title") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "payment" (
  "id" SERIAL PRIMARY KEY,
  "ordersheet_id" INT UNIQUE,
  "payment_method" VARCHAR(50),
  "status" VARCHAR(20),
  "transaction_id" VARCHAR(255) UNIQUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payment_ordersheet_id_fkey FOREIGN KEY ("ordersheet_id")
    REFERENCES "ordersheet" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "shipment" (
  "id" SERIAL PRIMARY KEY,
  "ordersheet_id" INT UNIQUE,
  "tracking_number" VARCHAR(255) UNIQUE NOT NULL,
  "carrier" VARCHAR(100),
  "status" VARCHAR(20),
  "estimated_delivery_date" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT shipment_ordersheet_id_fkey FOREIGN KEY ("ordersheet_id")
    REFERENCES "ordersheet" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "review" (
  "id" SERIAL PRIMARY KEY,
  "member_id" INT,
  "product_id" VARCHAR(255),
  "rating" INT,
  "message" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_member_id_fkey FOREIGN KEY ("member_id")
    REFERENCES "member" ("id") ON DELETE CASCADE,
  CONSTRAINT review_product_id_fkey FOREIGN KEY ("product_id")
    REFERENCES "product" ("title") ON DELETE CASCADE
);
