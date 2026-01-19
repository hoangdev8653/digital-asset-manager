CREATE TABLE "employees" (
  "id" integer PRIMARY KEY,
  "full_name" varchar,
  "email" varchar UNIQUE,
  "department_id" integer,
  "role" varchar,
  "status" varchar,
  "created_at" timestamp
);

CREATE TABLE "asset_types" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text
);

CREATE TABLE "assets" (
  "id" integer PRIMARY KEY,
  "asset_type_id" integer,
  "title" varchar,
  "metadata" json,
  "status" varchar,
  "expired_at" timestamp,
  "created_at" timestamp
);

CREATE TABLE "assignments" (
  "id" integer PRIMARY KEY,
  "asset_id" integer,
  "employee_id" integer,
  "assigned_at" timestamp,
  "assigned_by" integer,
  "note" text,
  "expired_at" timestamp,
  "status" varchar
);

CREATE TABLE "reports" (
  "id" integer PRIMARY KEY,
  "assignment_id" integer,
  "employee_id" integer,
  "report_type" varchar,
  "description" text,
  "evidence_image_url" varchar,
  "status" varchar,
  "admin_note" text,
  "created_at" timestamp,
  "resolved_at" timestamp
);

CREATE TABLE "notifications" (
  "id" integer PRIMARY KEY,
  "employee_id" integer,
  "title" varchar,
  "message" text,
  "is_read" boolean DEFAULT false,
  "type" varchar,
  "created_at" timestamp
);

ALTER TABLE "assets" ADD FOREIGN KEY ("asset_type_id") REFERENCES "asset_types" ("id");

ALTER TABLE "assignments" ADD FOREIGN KEY ("asset_id") REFERENCES "assets" ("id");

ALTER TABLE "assignments" ADD FOREIGN KEY ("employee_id") REFERENCES "employees" ("id");

ALTER TABLE "assignments" ADD FOREIGN KEY ("assigned_by") REFERENCES "employees" ("id");

ALTER TABLE "reports" ADD FOREIGN KEY ("assignment_id") REFERENCES "assignments" ("id");

ALTER TABLE "reports" ADD FOREIGN KEY ("employee_id") REFERENCES "employees" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("employee_id") REFERENCES "employees" ("id");
