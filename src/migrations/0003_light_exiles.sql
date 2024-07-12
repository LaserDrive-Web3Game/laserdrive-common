ALTER TABLE "player_entry" ADD COLUMN "user" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_entry" ADD CONSTRAINT "player_entry_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
