CREATE TYPE "cases_event" AS ENUM (
  'Pas de réponse',
  'RDV',
  'Rappel',
  'Refus',
  'N/A'
);

CREATE TYPE "meeting_types" AS ENUM (
  'Extérieur',
  'Téléphone/Visio',
  'Table de réunion'
);

CREATE TABLE "cdp" (
  "id_user" SERIAL PRIMARY KEY,
  "name" varchar,
  "surname" varchar,
  "mail" varchar,
  "pseudo" varchar,
  "token_email" varchar
);

CREATE TABLE "meeting_table_agenda" (
  "link" varchar
);

CREATE TABLE "events" (
  "id_event" SERIAL PRIMARY KEY,
  "id_user" int,
  "prospect" int,
  "event" cases_event,
  "creation_date" timestamp
);

CREATE TABLE "prospects" (
  "id_prospect" int PRIMARY KEY,
  "company_name" varchar NOT NULL,
  "activity_domain" varchar,
  "phone" varchar,
  "street_address" varchar,
  "city" int,
  "country" int,
  "website" varchar,
  "email" varchar,
  "last_event" prospect_events DEFAULT 'N/A',
  "comment" varchar,
  "nb_no" int
);

CREATE TABLE "prospect_contact" (
  "id_contact" SERIAL PRIMARY KEY,
  "id_prospect" int,
  "firstname" varchar,
  "lastname" varchar,
  "position" varchar
);

CREATE TABLE "sent_emails" (
  "id_mail" SERIAL PRIMARY KEY,
  "id_user" int,
  "email" varchar,
  "object" varchar,
  "message" varchar,
  "sending_date" timestamp
);

CREATE TABLE "bookmarks" (
  "id_bookmark" SERIAL PRIMARY KEY,
  "id_user" int,
  "id_prospect" int,
  "bookmark_creation" timestamp
);

CREATE TABLE "websites" (
  "id_website" SERIAL PRIMARY KEY,
  "id_owner" int,
  "website" varchar
);

CREATE TABLE "emails" (
  "id_email" SERIAL PRIMARY KEY,
  "id_owner" int,
  "email" varchar
);

CREATE TABLE "phones" (
  "id_phone" SERIAL PRIMARY KEY,
  "id_owner" int,
  "phone_number" varchar
);

CREATE TABLE "activities" (
  "id_activity" SERIAL PRIMARY KEY,
  "activity_name" varchar
);

CREATE TABLE "cities" (
  "id_city" SERIAL PRIMARY KEY,
  "city_name" varchar,
  "zip_code" int
);

CREATE TABLE "countries" (
  "id_country" SERIAL PRIMARY KEY,
  "country_name" varchar
);

CREATE TABLE "reminders" (
  "id_reminder" int PRIMARY KEY,
  "id_user" int,
  "id_prospect" int,
  "description" varchar,
  "priority" int,
  "reminding_date" varchar
);

CREATE TABLE "meetings" (
  "id_meeting" SERIAL PRIMARY KEY,
  "meeting_type" meeting_types DEFAULT 'Téléphone/Visio',
  "meeting_date" varchar,
  "id_user" int,
  "id_prospect" int
);

CREATE TABLE "goals" (
  "id_goal" SERIAL PRIMARY KEY,
  "is_cyclic" boolean DEFAULT true,
  "deadline" datetime,
  "goal_title" varchar,
  "goal_description" varchar,
  "achievement_total_steps" int,
  "current_achievement" int,
  "user" int
);

COMMENT ON COLUMN "prospects"."last_event" IS 'Dernier événement lié au prospect';

ALTER TABLE "events" ADD FOREIGN KEY ("id_user") REFERENCES "cdp" ("id_user");

ALTER TABLE "events" ADD FOREIGN KEY ("prospect") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "prospect_contact" ADD FOREIGN KEY ("id_prospect") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "sent_emails" ADD FOREIGN KEY ("id_user") REFERENCES "cdp" ("id_user");

ALTER TABLE "sent_emails" ADD FOREIGN KEY ("email") REFERENCES "emails" ("id_email");

ALTER TABLE "bookmarks" ADD FOREIGN KEY ("id_user") REFERENCES "cdp" ("id_user");

ALTER TABLE "bookmarks" ADD FOREIGN KEY ("id_prospect") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "websites" ADD FOREIGN KEY ("id_owner") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "websites" ADD FOREIGN KEY ("id_owner") REFERENCES "prospect_contact" ("id_contact");

ALTER TABLE "emails" ADD FOREIGN KEY ("id_owner") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "emails" ADD FOREIGN KEY ("id_owner") REFERENCES "prospect_contact" ("id_contact");

ALTER TABLE "phones" ADD FOREIGN KEY ("id_owner") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "phones" ADD FOREIGN KEY ("id_owner") REFERENCES "prospect_contact" ("id_contact");

ALTER TABLE "prospects" ADD FOREIGN KEY ("activity_domain") REFERENCES "activities" ("id_activity");

ALTER TABLE "prospects" ADD FOREIGN KEY ("city") REFERENCES "cities" ("id_city");

ALTER TABLE "prospects" ADD FOREIGN KEY ("country") REFERENCES "countries" ("id_country");

ALTER TABLE "reminders" ADD FOREIGN KEY ("id_user") REFERENCES "cdp" ("id_user");

ALTER TABLE "reminders" ADD FOREIGN KEY ("id_prospect") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "meetings" ADD FOREIGN KEY ("id_user") REFERENCES "cdp" ("id_user");

ALTER TABLE "meetings" ADD FOREIGN KEY ("id_prospect") REFERENCES "prospects" ("id_prospect");

ALTER TABLE "goals" ADD FOREIGN KEY ("user") REFERENCES "cdp" ("id_user");
