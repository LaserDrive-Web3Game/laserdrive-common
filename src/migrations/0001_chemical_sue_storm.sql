CREATE TABLE IF NOT EXISTS "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" integer NOT NULL,
	"balance" numeric(50, 0) DEFAULT '0.00',
	"created_at" timestamp,
	"updated_at" timestamp (3),
	CONSTRAINT "wallets_user_unique" UNIQUE("user")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
