CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" char(300) NOT NULL,
	"nonce" char(50),
	"created_at" timestamp,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "users" USING btree ("address");