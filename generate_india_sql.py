import json

with open('data.json', encoding='utf-8') as f:
    data = json.load(f)

india = [d for d in data if d.get('country_located') == 'India']

def sql_str(v):
    if v is None:
        return 'NULL'
    return "'" + str(v).replace("'", "''") + "'"

def sql_num(v):
    if v is None:
        return 'NULL'
    return str(v)

def sql_bool(v):
    if v is None:
        return 'NULL'
    return 'TRUE' if v else 'FALSE'

def sql_arr(v):
    if not v:
        return "ARRAY[]::text[]"
    items = [sql_str(x) for x in v]
    return "ARRAY[" + ", ".join(items) + "]::text[]"

def sql_json(v):
    if v is None:
        return "'{}'::jsonb"
    s = json.dumps(v, ensure_ascii=False)
    return sql_str(s) + "::jsonb"

policy_keys = [
    'study_in_india_code',
    'iccr_scholarship_eligible',
    'frro_registration_required',
    'aicte_ugc_approval',
    'medium_of_instruction_certificate_accepted'
]

lines = []
lines.append("-- ============================================================================")
lines.append("-- 1. INSERT INDIAN UNIVERSITIES INTO public.universities")
lines.append("-- ============================================================================")
lines.append("""INSERT INTO public.universities (
  organization,
  eligible_countries,
  notable_accolades,
  education_levels,
  fields,
  minimum_gpa,
  max_age,
  required_documents,
  application_url,
  application_process,
  number_of_recommendation_letters_required,
  essays_required,
  financial_aid_policy,
  tuition_waiver_threshold,
  accepted_application_platform,
  application_fee,
  country_located,
  campus_locations,
  university_type,
  minimum_standardized_test_scores,
  school_year_starting_date,
  funding_type,
  annual_tuitioin_coveratge_cost,
  age_restrictions,
  recommendation_letter_types,
  program_delivery_mode,
  english_proficiency_required,
  accepted_english_proficiency_tests,
  university_policies
) VALUES""")

values_blocks = []
for idx, u in enumerate(india):
    policy_dict = {k: u.get(k) for k in policy_keys if k in u}
    
    val_parts = [
        f"  {sql_str(u.get('organization'))}",
        f"  {sql_arr(u.get('eligible_countries'))}",
        f"  {sql_arr(u.get('notable_accolades'))}",
        f"  {sql_arr(u.get('education_levels'))}",
        f"  {sql_arr(u.get('fields'))}",
        f"  {sql_num(u.get('minimum_gpa'))}",
        f"  {sql_num(u.get('max_age'))}",
        f"  {sql_arr(u.get('required_documents'))}",
        f"  {sql_str(u.get('application_url'))}",
        f"  {sql_str(u.get('application_process'))}",
        f"  {sql_str(u.get('number_of_recommendation_letters_required'))}",
        f"  {sql_str(u.get('essays_required'))}",
        f"  {sql_str(u.get('financial_aid_policy'))}",
        f"  {sql_num(None)}",  # tuition_waiver_threshold numeric column
        f"  {sql_arr(u.get('accepted_application_platform'))}",
        f"  {sql_str(u.get('application_fee'))}",
        f"  {sql_str(u.get('country_located'))}",
        f"  {sql_arr(u.get('campus_locations'))}",
        f"  {sql_str(u.get('university_type'))}",
        f"  {sql_arr(u.get('minimum_standardized_test_scores'))}",
        f"  {sql_str(u.get('school_year_starting_date'))}",
        f"  {sql_str(u.get('funding_type'))}",
        f"  {sql_num(u.get('annual_tuitioin_coveratge_cost'))}",
        f"  {sql_str(u.get('age_restrictions'))}",
        f"  {sql_str(u.get('recommendation_letter_types'))}",
        f"  {sql_str(u.get('program_delivery_mode'))}",
        f"  {sql_bool(u.get('english_proficiency_required'))}",
        f"  {sql_arr(u.get('accepted_english_proficiency_tests'))}",
        f"  {sql_json(policy_dict)}"
    ]
    val_str = "(\n" + ",\n".join(val_parts) + "\n)"
    values_blocks.append(val_str)

lines.append(",\n".join(values_blocks))
lines.append("""ON CONFLICT (organization) DO UPDATE SET
  eligible_countries = EXCLUDED.eligible_countries,
  notable_accolades = EXCLUDED.notable_accolades,
  education_levels = EXCLUDED.education_levels,
  fields = EXCLUDED.fields,
  minimum_gpa = EXCLUDED.minimum_gpa,
  max_age = EXCLUDED.max_age,
  required_documents = EXCLUDED.required_documents,
  application_url = EXCLUDED.application_url,
  application_process = EXCLUDED.application_process,
  number_of_recommendation_letters_required = EXCLUDED.number_of_recommendation_letters_required,
  essays_required = EXCLUDED.essays_required,
  financial_aid_policy = EXCLUDED.financial_aid_policy,
  tuition_waiver_threshold = EXCLUDED.tuition_waiver_threshold,
  accepted_application_platform = EXCLUDED.accepted_application_platform,
  application_fee = EXCLUDED.application_fee,
  country_located = EXCLUDED.country_located,
  campus_locations = EXCLUDED.campus_locations,
  university_type = EXCLUDED.university_type,
  minimum_standardized_test_scores = EXCLUDED.minimum_standardized_test_scores,
  school_year_starting_date = EXCLUDED.school_year_starting_date,
  funding_type = EXCLUDED.funding_type,
  annual_tuitioin_coveratge_cost = EXCLUDED.annual_tuitioin_coveratge_cost,
  age_restrictions = EXCLUDED.age_restrictions,
  recommendation_letter_types = EXCLUDED.recommendation_letter_types,
  program_delivery_mode = EXCLUDED.program_delivery_mode,
  english_proficiency_required = EXCLUDED.english_proficiency_required,
  accepted_english_proficiency_tests = EXCLUDED.accepted_english_proficiency_tests,
  university_policies = EXCLUDED.university_policies;
""")

lines.append("-- ============================================================================")
lines.append("-- 2. INSERT DEADLINES INTO public.university_deadlines")
lines.append("-- ============================================================================")
lines.append("""-- Clear old deadlines for these universities to prevent duplicates if re-executed
DELETE FROM public.university_deadlines
WHERE university_id IN (
  SELECT id FROM public.universities WHERE country_located = 'India'
);

INSERT INTO public.university_deadlines (
  university_id,
  deadline_type,
  deadline_date
) VALUES""")

deadline_rows = []
for u in india:
    org_name = u.get('organization')
    deadlines = u.get('deadline', [])
    for dl in deadlines:
        dt = sql_str(dl.get('deadline_type'))
        d_val = sql_str(dl.get('date'))
        deadline_rows.append(f"  ((SELECT id FROM public.universities WHERE organization = {sql_str(org_name)}), {dt}, {d_val})")

lines.append(",\n".join(deadline_rows) + ";")

with open('insert_india_universities.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print(f"Generated insert_india_universities.sql successfully with {len(india)} universities and {len(deadline_rows)} deadlines.")
