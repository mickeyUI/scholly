CREATE TABLE "public"."universities" (
  "id"                                        uuid    NOT NULL DEFAULT gen_random_uuid(),
  "organization"                              text    NOT NULL,
  "eligible_countries"                        text[]  DEFAULT '{}'::text[],
  "notable_accolades"                         text[]  DEFAULT '{}'::text[],
  "education_levels"                          text[]  DEFAULT '{}'::text[],
  "fields"                                    text[]  DEFAULT '{}'::text[],
  "minimum_gpa"                               numeric,
  "max_age"                                   integer,
  "required_documents"                        text[]  DEFAULT '{}'::text[],
  "application_url"                           text,
  "application_process"                       text,
  "number_of_recommendation_letters_required" text,
  "essays_required"                           text,
  "financial_aid_policy"                      text,
  "tuition_waiver_threshold"                  numeric,
  "accepted_application_platform"             text[]  DEFAULT '{}'::text[],
  "application_fee"                           text,
  "country_located"                           text,
  "campus_locations"                          text[]  DEFAULT '{}'::text[],
  "university_type"                           text,
  "minimum_standardized_test_scores"          text[]  DEFAULT '{}'::text[],
  "school_year_starting_date"                 text,
  "funding_type"                              text,
  "annual_tuitioin_coveratge_cost"            numeric,
  "age_restrictions"                          text,
  "recommendation_letter_types"               text,
  "program_delivery_mode"                     text,
  "english_proficiency_required"              boolean,
  "need_blind"                                boolean,
  "sat_required"                              boolean,
  "accepted_english_proficiency_tests"        text[]  DEFAULT '{}'::text[],
  CONSTRAINT "universities_organization_key" UNIQUE (organization),
  CONSTRAINT "universities_pkey" PRIMARY KEY (id)
);

CREATE TABLE "public"."university_deadlines" (
  "id"            uuid NOT NULL DEFAULT gen_random_uuid(),
  "university_id" uuid NOT NULL,
  "deadline_type" text NOT NULL,
  "deadline_date" text NOT NULL,
  CONSTRAINT "university_deadlines_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."university_deadlines"
  ADD CONSTRAINT "university_deadlines_university_id_fkey" FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."universities" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."universities" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."universities" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."universities" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."university_deadlines" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."university_deadlines" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."university_deadlines" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."university_deadlines" TO "service_role";

