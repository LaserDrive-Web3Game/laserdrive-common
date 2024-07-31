DO $$ BEGIN
 CREATE TYPE "public"."gameStatus" AS ENUM('active', 'done', 'preparing');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."entryStatus" AS ENUM('active', 'lost', 'won');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_status" "gameStatus" DEFAULT 'preparing',
	"final_multiplier" numeric(10, 2),
	"created_at" timestamp,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"nonce" text,
	"created_at" timestamp,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_entry" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" integer,
	"game_session" integer,
	"amount" numeric(50, 0),
	"status" "entryStatus" DEFAULT 'active',
	"exit_point" numeric(10, 2),
	"created_at" timestamp,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
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
 ALTER TABLE "player_entry" ADD CONSTRAINT "player_entry_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_entry" ADD CONSTRAINT "player_entry_game_session_game_session_id_fk" FOREIGN KEY ("game_session") REFERENCES "public"."game_session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "users" USING btree ("address");