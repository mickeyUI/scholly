type Deadline = {
  deadline_type: string;
  date: string;
};
export type FastAPIScholarship = {
  organization: string | null;
  eligible_countries: string[];
  notable_accolades: string[];
  education_levels: string[];
  fields: string[];
  minimum_gpa: number | null;
  max_age: number | null;
  english_proficency_required: string[];
  deadline: Deadline[];
  required_documents: string[];
  application_url: string | null;
  "application process": string | null;
  number_of_recommendation_letters_required: number | null;
  essays_required: string | null;
  financial_aid_policy: string | null;
  tuition_waiver_threshold: number | null;
  accepted_application_platform: string[];
  application_fee: number | null;
  country_located: string | null;
  campus_locations: string[];
  university_type: string | null;
  international_student_population: number | null;
  minimum_standardized_test_scores: string[];
  school_year_starting_date: string | null;
  funding_type: string | null;
  annual_tuitioin_coveratge_cost: number | null;
  age_restrictions: string | null;
  recommendation_letter_types: string | null;
  program_delivery_mode: string | null;
};

export type SupabaseScholarship = {
  organization: string;
  eligible_countries: string[];
  notable_accolades: string[];
  education_levels: string[];
  fields: string[];
  minimum_gpa: number | null;
  max_age: number | null;
  english_proficency_required: string[];
  deadline: string[];
  required_documents: string[];
  application_url: string;
  application_process: string;
  number_of_recommendation_letters_required: number | null;
  essays_required: string;
  financial_aid_policy: string;
  tuition_waiver_threshold: number | null;
  accepted_application_platform: string[];
  application_fee: number | null;
  country_located: string;
  campus_locations: string[];
  university_type: string;
  international_student_population: number | null;
  minimum_standardized_test_scores: string[];
  school_year_starting_date: string | null;
  funding_type: string;
  annual_tuitioin_coveratge_cost: number | null;
  age_restrictions: string;
  recommendation_letter_types: string;
  program_delivery_mode: string;
};

export type FormData = {
  organization: string;
  eligible_countries: string;
  notable_accolades: string;
  education_levels: string;
  fields: string;
  minimum_gpa: string;
  max_age: string;
  english_proficency_required: string;
  deadline: string;
  required_documents: string;
  application_url: string;
  application_process: string;
  number_of_recommendation_letters_required: string;
  essays_required: string;
  financial_aid_policy: string;
  tuition_waiver_threshold: string;
  accepted_application_platform: string;
  application_fee: string;
  country_located: string;
  campus_locations: string;
  university_type: string;
  international_student_population: string;
  minimum_standardized_test_scores: string;
  school_year_starting_date: string;
  funding_type: string;
  annual_tuitioin_coveratge_cost: string;
  age_restrictions: string;
  recommendation_letter_types: string;
  program_delivery_mode: string;
};

function parseArray(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseNumber(value: string): number | null {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

function parseIntOrNull(value: string): number | null {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

export function formDataToSupabase(form: FormData): SupabaseScholarship {
  return {
    organization: form.organization || "",
    eligible_countries: parseArray(form.eligible_countries),
    notable_accolades: parseArray(form.notable_accolades),
    education_levels: parseArray(form.education_levels),
    fields: parseArray(form.fields),
    minimum_gpa: parseNumber(form.minimum_gpa),
    max_age: parseIntOrNull(form.max_age),
    english_proficency_required: parseArray(form.english_proficency_required),
    deadline: parseArray(form.deadline),
    required_documents: parseArray(form.required_documents),
    application_url: form.application_url || "",
    application_process: form.application_process || "",
    number_of_recommendation_letters_required: parseIntOrNull(
      form.number_of_recommendation_letters_required,
    ),
    essays_required: form.essays_required,
    financial_aid_policy: form.financial_aid_policy || "",
    tuition_waiver_threshold: parseNumber(form.tuition_waiver_threshold),
    accepted_application_platform: parseArray(
      form.accepted_application_platform,
    ),
    application_fee: parseNumber(form.application_fee),
    country_located: form.country_located || "",
    campus_locations: parseArray(form.campus_locations),
    university_type: form.university_type || "",
    international_student_population: parseIntOrNull(
      form.international_student_population,
    ),
    minimum_standardized_test_scores: parseArray(
      form.minimum_standardized_test_scores,
    ),
    school_year_starting_date: form.school_year_starting_date || "",
    funding_type: form.funding_type || "",
    annual_tuitioin_coveratge_cost: parseNumber(
      form.annual_tuitioin_coveratge_cost,
    ),
    age_restrictions: form.age_restrictions || "",
    recommendation_letter_types: form.recommendation_letter_types || "",
    program_delivery_mode: form.program_delivery_mode || "",
  };
}

export function fastAPIToFormData(api: FastAPIScholarship): FormData {
  return {
    organization: api.organization || "",
    eligible_countries: api.eligible_countries.join(", "),
    notable_accolades: api.notable_accolades.join(", "),
    education_levels: api.education_levels.join(", "),
    fields: api.fields.join(", "),
    minimum_gpa: api.minimum_gpa !== null ? String(api.minimum_gpa) : "",
    max_age: api.max_age !== null ? String(api.max_age) : "",
    english_proficency_required: api.english_proficency_required.join(", "),
    deadline: api.deadline
      .map((dline) => `${dline.deadline_type}: ${dline.date}`)
      .join(", "),
    required_documents: api.required_documents.join(", "),
    application_url: api.application_url || "",
    application_process: api["application process"] || "",
    number_of_recommendation_letters_required:
      api.number_of_recommendation_letters_required !== null
        ? String(api.number_of_recommendation_letters_required)
        : "",
    essays_required: api.essays_required ?? "",
    financial_aid_policy: api.financial_aid_policy || "",
    tuition_waiver_threshold:
      api.tuition_waiver_threshold !== null
        ? String(api.tuition_waiver_threshold)
        : "",
    accepted_application_platform: api.accepted_application_platform.join(", "),
    application_fee:
      api.application_fee !== null ? String(api.application_fee) : "",
    country_located: api.country_located || "",
    campus_locations: api.campus_locations.join(", "),
    university_type: api.university_type || "",
    international_student_population:
      api.international_student_population !== null
        ? String(api.international_student_population)
        : "",
    minimum_standardized_test_scores:
      api.minimum_standardized_test_scores.join(", "),
    school_year_starting_date: api.school_year_starting_date || "",
    funding_type: api.funding_type || "",
    annual_tuitioin_coveratge_cost:
      api.annual_tuitioin_coveratge_cost !== null
        ? String(api.annual_tuitioin_coveratge_cost)
        : "",
    age_restrictions: api.age_restrictions || "",
    recommendation_letter_types: api.recommendation_letter_types || "",
    program_delivery_mode: api.program_delivery_mode || "",
  };
}

export function getEmptyFormData(): FormData {
  return {
    organization: "",
    eligible_countries: "",
    notable_accolades: "",
    education_levels: "",
    fields: "",
    minimum_gpa: "",
    max_age: "",
    english_proficency_required: "",
    deadline: "",
    required_documents: "",
    application_url: "",
    application_process: "",
    number_of_recommendation_letters_required: "",
    essays_required: "",
    financial_aid_policy: "",
    tuition_waiver_threshold: "",
    accepted_application_platform: "",
    application_fee: "",
    country_located: "",
    campus_locations: "",
    university_type: "",
    international_student_population: "",
    minimum_standardized_test_scores: "",
    school_year_starting_date: "",
    funding_type: "",
    annual_tuitioin_coveratge_cost: "",
    age_restrictions: "",
    recommendation_letter_types: "",
    program_delivery_mode: "",
  };
}
