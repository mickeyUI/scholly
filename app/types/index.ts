export interface DeadlineInfo {
  type: string;
  date: string;
  notes?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  country_located: string;
  eligible_countries: string[];
  education_levels: string[];
  fields: string[];
  funding_type: string; // 'Fully Funded', 'Tuition Waiver', 'Partial Funding', 'Research Grant'
  annual_coverage_cost?: number | null;
  award_details: {
    tuition_covered: boolean;
    monthly_stipend?: string;
    travel_covered?: boolean;
    health_insurance?: boolean;
    additional_allowances?: string;
  };
  minimum_gpa: number | null;
  max_age: number | null;
  english_proficiency_required: string[];
  deadlines: DeadlineInfo[];
  required_documents: string[];
  application_url: string;
  application_process: string;
  application_fee: number | null;
  notable_accolades: string[];
  number_of_recommendation_letters_required: number | null;
  essays_required?: string;
  program_delivery_mode: string;
  source_name: string; // e.g., 'DAAD Portal', 'Oxford University Portal'
  source_url: string;
  verification_date: string;
  is_verified: boolean;
}

export interface UniversityProgram {
  name: string;
  degree_level: string; // 'Bachelor', 'Master', 'PhD'
  faculty: string;
  tuition_per_year_usd: number;
  duration_years: number;
  language: string;
}

export interface ChinaPolicies {
  c9_league_member?: boolean;
  csc_agency_number?: string;
  csc_scholarship_supported?: boolean;
  double_first_class?: boolean;
  english_taught_degrees_offered?: boolean;
  hsk_score_required_for_chinese_tracks?: string;
  jw202_visa_form_provided?: boolean;
}

export interface IndiaPolicies {
  aicte_ugc_approval?: string;
  frro_registration_required?: boolean;
  iccr_scholarship_eligible?: boolean;
  medium_of_instruction_certificate_accepted?: boolean;
  study_in_india_code?: string;
}

export interface ItalyPolicies {
  cimea_or_dov_required?: boolean;
  dsu_regional_scholarship_board?: string;
  isee_parificato_eligible?: boolean;
  post_study_work_stay_back_months?: number;
  tolc_or_imat_exam_accepted?: boolean;
  universitaly_pre_enrollment_required?: boolean;
}

export interface JapanPolicies {
  coe_visa_sponsorship?: boolean;
  jica_abe_initiative_partner?: boolean;
  mext_scholarship_recommendations?: boolean;
  part_time_work_hours_per_week?: number;
  post_study_work_visa?: string;
  sgu_top_global_status?: boolean;
}

export interface RomaniaPolicies {
  eu_recognized_medical_degree?: boolean;
  mae_romanian_mfa_scholarship_eligible?: boolean;
  ministry_acceptance_letter_mandatory?: boolean;
  post_study_stay_back_months?: number;
  preparatory_year_romanian_offered?: boolean;
  work_rights_during_studies?: string;
}

export interface SaudiArabiaPolicies {
  campus_housing_provided?: boolean;
  flight_tickets_provided?: boolean;
  gender_campus_policy?: string;
  royal_scholarship_stipend_monthly?: string | number;
  student_visa_iqama_sponsorship?: boolean;
  study_in_saudi_portal_listed?: boolean;
}

export interface SouthKoreaPolicies {
  d10_job_seeker_stay_back_duration?: string;
  gks_kgsp_eligible?: boolean;
  ieqas_certification_status?: boolean;
  korean_language_institute_available?: boolean;
  topik_requirement_or_prep?: string;
}

export interface TurkiyePolicies {
  denklik_diploma_equivalency_required?: boolean;
  language_of_instruction_ratio?: string;
  tomer_turkish_prep_year_offered?: boolean;
  turkiye_burslari_ytb_eligible?: boolean;
  yos_or_tr_yos_accepted?: boolean;
}

export interface UnitedStatesPolicies {
  need_blind?: boolean;
  sat_required?: boolean;
}

export interface MauritiusPolicies {
  mass_scholarship_eligible?: boolean;
  hec_accredited?: boolean;
  ypop_stay_back_eligible?: boolean;
  awarding_body_parent_institution?: string;
  language_of_instruction?: string;
}

export type UniversityPolicies =
  | (ChinaPolicies &
      IndiaPolicies &
      ItalyPolicies &
      JapanPolicies &
      RomaniaPolicies &
      SaudiArabiaPolicies &
      SouthKoreaPolicies &
      TurkiyePolicies &
      UnitedStatesPolicies &
      MauritiusPolicies)
  | Record<string, any>;

export type SupabaseUniversity = {
  id?: string;
  organization: string;
  eligible_countries: string[];
  notable_accolades: string[];
  education_levels: string[];
  fields: string[];
  minimum_gpa: number | null;
  max_age: number | null;
  required_documents: string[];
  application_url: string;
  application_process: string;
  number_of_recommendation_letters_required: number | string | null;
  essays_required: string;
  financial_aid_policy: string;
  tuition_waiver_threshold: number | null;
  accepted_application_platform: string[];
  application_fee: string | null;
  country_located: string;
  campus_locations: string[];
  university_type: string;
  minimum_standardized_test_scores: string[];
  school_year_starting_date: string | null;
  funding_type: string;
  annual_tuitioin_coveratge_cost: number | null;
  age_restrictions: string;
  recommendation_letter_types: string;
  program_delivery_mode: string;
  english_proficiency_required: boolean | null;
  accepted_english_proficiency_tests: string[];
  university_policies?: UniversityPolicies;
  logo_url?: string | null;
  // Backwards compatibility with previous schema
  need_blind?: boolean | null;
  sat_required?: boolean | null;
  university_deadlines?: {
    id?: string;
    deadline_type: string;
    deadline_date: string;
    university_id?: string;
  }[];
  // Backward compatibility fields
  name?: string;
  country?: string;
  city?: string;
  world_ranking?: number;
  international_student_population?: number;
  acceptance_rate_percent?: number;
  standardized_tests?: string[];
  website_url?: string;
  admissions_url?: string;
  programs?: UniversityProgram[];
  deadlines?: DeadlineInfo[];
  scholarship_opportunities_count?: number;
  source_name?: string;
  source_url?: string;
  verification_date?: string;
  is_verified?: boolean;
};

export type University = SupabaseUniversity;
export type SupabaseScholarship = SupabaseUniversity;

export interface LegacyUniversity {
  id: string;
  name: string;
  country: string;
  city: string;
  campus_locations: string[];
  university_type: 'Public' | 'Private';
  world_ranking?: number;
  international_student_population?: number;
  acceptance_rate_percent?: number;
  minimum_gpa: number | null;
  english_proficiency_required: string[];
  standardized_tests: string[]; // e.g. 'SAT: 1300+', 'GRE: 310+'
  application_fee: number;
  website_url: string;
  admissions_url: string;
  programs: UniversityProgram[];
  deadlines: DeadlineInfo[];
  financial_aid_policy: string;
  scholarship_opportunities_count: number;
  source_name: string;
  source_url: string;
  verification_date: string;
  is_verified: boolean;
  notable_accolades: string[];
}

export interface StudentProfile {
  id?: string;
  full_name: string;
  email: string;
  nationality: string;
  current_education_level: string;
  target_degree_level: string;
  field_of_study: string;
  gpa: number | null;
  english_proficiency: string; // 'IELTS', 'TOEFL', 'Duolingo', 'Native/Exempt', 'None'
  max_annual_budget_usd: number;
  preferred_destinations: string[];
  needs_full_funding: boolean;
}

export interface SavedItem {
  id: string;
  type: 'scholarship' | 'university';
  target_id: string;
  title: string;
  institution_or_org: string;
  country: string;
  deadline: string;
  funding_or_tuition: string;
  saved_at: string;
  status: 'Saved' | 'In Progress' | 'Submitted' | 'Accepted';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: {
    label: string;
    url: string;
    fact: string;
  }[];
  suggestedOpportunities?: {
    id: string;
    type: 'scholarship' | 'university';
    title: string;
    subtitle: string;
    coverageOrTuition: string;
  }[];
}
