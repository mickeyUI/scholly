import { University, UniversityPolicies } from "../types";

export type PolicyCategory = "scholarship" | "visa" | "academics" | "language";

export interface FormattedPolicyItem {
  key: string;
  label: string;
  valueDisplay: string;
  category: PolicyCategory;
  isPositive: boolean;
  tooltip?: string;
}

export interface PolicyGroup {
  id: PolicyCategory;
  title: string;
  description: string;
  items: FormattedPolicyItem[];
}

export interface FlagshipBadge {
  label: string;
  variant: "gold" | "emerald" | "blue" | "purple" | "zinc";
}

/**
 * Metadata definition for every country-specific policy key
 */
const POLICY_METADATA: Record<
  string,
  {
    label: string;
    category: PolicyCategory;
    tooltip?: string;
    formatValue?: (val: any) => { display: string; isPositive: boolean };
  }
> = {
  // === China ===
  c9_league_member: {
    label: "C9 League Member",
    category: "academics",
    tooltip: "Member of China's elite group of nine top universities (China's Ivy League).",
    formatValue: (v) => ({
      display: v ? "C9 League Elite Institution" : "Not a C9 Member",
      isPositive: Boolean(v),
    }),
  },
  csc_agency_number: {
    label: "CSC Agency Code",
    category: "scholarship",
    tooltip: "Official Chinese Scholarship Council (CSC) institution identifier for government scholarship applications.",
    formatValue: (v) => ({
      display: v ? `Code: ${v}` : "Not Listed",
      isPositive: Boolean(v),
    }),
  },
  csc_scholarship_supported: {
    label: "CSC Scholarship Supported",
    category: "scholarship",
    tooltip: "Eligible for Chinese Government Scholarship (CSC Type A & B) with full tuition, stipend & housing.",
    formatValue: (v) => ({
      display: v ? "Fully Supported (Type A & B)" : "Not Supported",
      isPositive: Boolean(v),
    }),
  },
  double_first_class: {
    label: "Double First Class University",
    category: "academics",
    tooltip: "Part of China's national elite higher education development plan.",
    formatValue: (v) => ({
      display: v ? "World-Class University Status" : "Standard University Status",
      isPositive: Boolean(v),
    }),
  },
  english_taught_degrees_offered: {
    label: "English-Taught Degrees",
    category: "language",
    tooltip: "Offers full English-medium bachelor's, master's, or PhD programs without requiring Chinese fluency.",
    formatValue: (v) => ({
      display: v ? "Fully English-Taught Tracks Available" : "Chinese Medium Only",
      isPositive: Boolean(v),
    }),
  },
  hsk_score_required_for_chinese_tracks: {
    label: "HSK Proficiency for Chinese Tracks",
    category: "language",
    tooltip: "Required HSK Chinese proficiency exam score for degrees taught in Chinese.",
    formatValue: (v) => ({
      display: v ? String(v) : "No HSK Required",
      isPositive: Boolean(v),
    }),
  },
  jw202_visa_form_provided: {
    label: "JW202 / JW201 Visa Form",
    category: "visa",
    tooltip: "Provides official State-issued JW202/JW201 visa authorization for X1/X2 international student visas.",
    formatValue: (v) => ({
      display: v ? "Issued for International Visas" : "Not Provided",
      isPositive: Boolean(v),
    }),
  },

  // === India ===
  aicte_ugc_approval: {
    label: "Government Accreditation",
    category: "academics",
    tooltip: "Official recognition by the University Grants Commission (UGC) and AICTE / INI status.",
    formatValue: (v) => ({
      display: v ? String(v) : "Not Listed",
      isPositive: Boolean(v),
    }),
  },
  frro_registration_required: {
    label: "FRRO Visa Registration",
    category: "visa",
    tooltip: "On-campus assistance for Foreigners Regional Registration Office (FRRO) permit in India.",
    formatValue: (v) => ({
      display: v ? "University FRRO Desk Assistance Provided" : "Self-Handled",
      isPositive: true,
    }),
  },
  iccr_scholarship_eligible: {
    label: "ICCR Scholarship Scheme",
    category: "scholarship",
    tooltip: "Eligible for Indian Council for Cultural Relations (ICCR) scholarship (100% tuition, hostel & stipend).",
    formatValue: (v) => ({
      display: v ? "Eligible (Full Tuition, Hostel & Living Stipend)" : "Not Eligible",
      isPositive: Boolean(v),
    }),
  },
  medium_of_instruction_certificate_accepted: {
    label: "English MOI Certificate Accepted",
    category: "language",
    tooltip: "Accepts Medium of Instruction (MOI) certificates from former schools in lieu of IELTS or TOEFL.",
    formatValue: (v) => ({
      display: v ? "Accepted in lieu of IELTS/TOEFL" : "Standardized Test Required",
      isPositive: Boolean(v),
    }),
  },
  study_in_india_code: {
    label: "Study in India (SII) Code",
    category: "academics",
    tooltip: "Official Study in India national portal registration code for subsidized seats & partner waivers.",
    formatValue: (v) => ({
      display: v ? `SII Partner (${v})` : "Standard Enrollment",
      isPositive: Boolean(v),
    }),
  },

  // === Italy ===
  cimea_or_dov_required: {
    label: "CIMEA Statement or DoV",
    category: "academics",
    tooltip: "Requires CIMEA Statement of Comparability or Declaration of Value (DoV) from the Italian Embassy.",
    formatValue: (v) => ({
      display: v ? "Required for Enrollment" : "Waived / Exempt",
      isPositive: !v,
    }),
  },
  dsu_regional_scholarship_board: {
    label: "DSU Regional Scholarship Board",
    category: "scholarship",
    tooltip: "Regional Italian DSU agency providing full tuition waiver, free meals, and cash living allowance.",
    formatValue: (v) => ({
      display: v ? `Administered by ${v}` : "Regional DSU Eligible",
      isPositive: true,
    }),
  },
  isee_parificato_eligible: {
    label: "ISEE Parificato Eligible",
    category: "scholarship",
    tooltip: "Allows international students to calculate ISEE Parificato for complete tuition reduction.",
    formatValue: (v) => ({
      display: v ? "Eligible for 100% Tuition Fee Reduction" : "Standard Fees Apply",
      isPositive: Boolean(v),
    }),
  },
  post_study_work_stay_back_months: {
    label: "Post-Study Work Stay-Back",
    category: "visa",
    tooltip: "Permitted legal stay-back duration to seek employment or launch a business after graduation in Italy.",
    formatValue: (v) => ({
      display: v ? `${v} Months Stay-Back Visa` : "Standard Visa Rules",
      isPositive: Boolean(v),
    }),
  },
  tolc_or_imat_exam_accepted: {
    label: "TOLC / IMAT Exam Accepted",
    category: "language",
    tooltip: "Accepts CISIA TOLC (English) or IMAT (for medicine) standardized national entrance examinations.",
    formatValue: (v) => ({
      display: v ? "Accepted for Direct Admission" : "Not Required",
      isPositive: Boolean(v),
    }),
  },
  universitaly_pre_enrollment_required: {
    label: "Universitaly Pre-Enrollment",
    category: "visa",
    tooltip: "Mandatory visa pre-enrollment via the Italian Ministry's official Universitaly portal.",
    formatValue: (v) => ({
      display: v ? "Mandatory via Universitaly Portal" : "Direct University Application",
      isPositive: true,
    }),
  },

  // === Japan ===
  coe_visa_sponsorship: {
    label: "COE Visa Sponsorship",
    category: "visa",
    tooltip: "Issues the Certificate of Eligibility (COE) required for Japanese student visa stamping.",
    formatValue: (v) => ({
      display: v ? "Direct COE Sponsorship Provided" : "No Direct Sponsorship",
      isPositive: Boolean(v),
    }),
  },
  jica_abe_initiative_partner: {
    label: "JICA ABE Initiative Partner",
    category: "scholarship",
    tooltip: "Partner university for Japan International Cooperation Agency (JICA) African Business Education initiative.",
    formatValue: (v) => ({
      display: v ? "Designated JICA ABE Partner Institution" : "Not Listed",
      isPositive: Boolean(v),
    }),
  },
  mext_scholarship_recommendations: {
    label: "MEXT Scholarship Recommendation",
    category: "scholarship",
    tooltip: "Can directly recommend students for Japanese Government MEXT Scholarships (full ride + airfare + stipend).",
    formatValue: (v) => ({
      display: v ? "University-Track MEXT Nominations Available" : "Embassy-Track Only",
      isPositive: Boolean(v),
    }),
  },
  part_time_work_hours_per_week: {
    label: "Part-Time Work Permission",
    category: "visa",
    tooltip: "Permitted part-time working hours with Immigration Bureau work permit (Shikakugai Katsudo Kyoka).",
    formatValue: (v) => ({
      display: v ? `${v} Hours / Week Permitted` : "Work Restricted",
      isPositive: Boolean(v),
    }),
  },
  post_study_work_visa: {
    label: "Post-Study Work Visa Route",
    category: "visa",
    tooltip: "Designated Activities Visa (Specified Skilled Worker or Job Hunter) availability for international alumni.",
    formatValue: (v) => ({
      display: v ? String(v) : "Designated Activities Visa Available",
      isPositive: true,
    }),
  },
  sgu_top_global_status: {
    label: "SGU Top Global Status",
    category: "academics",
    tooltip: "Selected for Japan's Super Global University (SGU) project with extensive English degree programs.",
    formatValue: (v) => ({
      display: v ? "Top Global University (SGU Designated)" : "Standard National/Private Status",
      isPositive: Boolean(v),
    }),
  },

  // === Romania ===
  eu_recognized_medical_degree: {
    label: "EU-Recognized Medical Degree",
    category: "academics",
    tooltip: "Degrees in Medicine, Dentistry, and Pharmacy comply with Directive 2005/36/EC for recognition across the EU.",
    formatValue: (v) => ({
      display: v ? "EU Recognized (Directive 2005/36/EC)" : "Not Applicable",
      isPositive: Boolean(v),
    }),
  },
  mae_romanian_mfa_scholarship_eligible: {
    label: "MAE Romanian MFA Scholarship",
    category: "scholarship",
    tooltip: "Eligible for Romanian Ministry of Foreign Affairs (MAE) scholarships for non-EU international scholars.",
    formatValue: (v) => ({
      display: v ? "Eligible (Full Tuition + Accommodation + Monthly Allowance)" : "Not Eligible",
      isPositive: Boolean(v),
    }),
  },
  ministry_acceptance_letter_mandatory: {
    label: "Ministry Letter of Acceptance",
    category: "visa",
    tooltip: "Requires Letter of Acceptance issued by the Romanian Ministry of National Education for the student visa.",
    formatValue: (v) => ({
      display: v ? "Mandatory Romanian Ministry Acceptance Letter" : "Direct University Admission",
      isPositive: true,
    }),
  },
  post_study_stay_back_months: {
    label: "Post-Study Stay-Back",
    category: "visa",
    tooltip: "Duration permitted to stay in Romania to search for employment after university graduation.",
    formatValue: (v) => ({
      display: v ? `${v} Months Post-Study Work Stay-Back` : "Standard EU Exit Period",
      isPositive: Boolean(v),
    }),
  },
  preparatory_year_romanian_offered: {
    label: "Romanian Language Prep Year",
    category: "language",
    tooltip: "Offers 1-year preparatory Romanian language immersion year before joining degree tracks.",
    formatValue: (v) => ({
      display: v ? "1-Year Romanian Prep Year Offered" : "Direct Entry Only",
      isPositive: Boolean(v),
    }),
  },
  work_rights_during_studies: {
    label: "Student Work Rights",
    category: "visa",
    tooltip: "Permitted part-time working hours for non-EU students during semester periods.",
    formatValue: (v) => ({
      display: v ? String(v) : "Permitted with Student Residence Permit",
      isPositive: true,
    }),
  },

  // === Saudi Arabia ===
  campus_housing_provided: {
    label: "Complimentary Campus Housing",
    category: "scholarship",
    tooltip: "Free on-campus student residential accommodation provided by the university.",
    formatValue: (v) => ({
      display: v ? "100% Free Furnished On-Campus Housing" : "Self-Funded Housing",
      isPositive: Boolean(v),
    }),
  },
  flight_tickets_provided: {
    label: "Annual Airfare Covered",
    category: "scholarship",
    tooltip: "Annual complimentary round-trip flight tickets between home country and Saudi Arabia.",
    formatValue: (v) => ({
      display: v ? "Annual Round-Trip Flight Tickets Provided" : "Airfare Self-Funded",
      isPositive: Boolean(v),
    }),
  },
  gender_campus_policy: {
    label: "Campus Structure & Gender Policy",
    category: "academics",
    tooltip: "Campus model (e.g., co-educational research campus vs segregated female/male colleges).",
    formatValue: (v) => ({
      display: v ? String(v) : "Standard Regulations",
      isPositive: true,
    }),
  },
  royal_scholarship_stipend_monthly: {
    label: "Monthly Royal Stipend",
    category: "scholarship",
    tooltip: "Monthly tax-free living allowance provided by the government scholarship.",
    formatValue: (v) => ({
      display: v ? (typeof v === "number" ? `$${v.toLocaleString()} / month` : String(v)) : "Subsidized Public Rates",
      isPositive: Boolean(v),
    }),
  },
  student_visa_iqama_sponsorship: {
    label: "Student Visa & Iqama Sponsorship",
    category: "visa",
    tooltip: "University sponsors the official Saudi Student Residence Permit (Iqama) with full medical coverage.",
    formatValue: (v) => ({
      display: v ? "Full University Sponsorship (Iqama + Medical)" : "Self-Sponsored",
      isPositive: Boolean(v),
    }),
  },
  study_in_saudi_portal_listed: {
    label: "Study in Saudi Portal Partner",
    category: "academics",
    tooltip: "Listed as an accredited partner university on the unified 'Study in Saudi' national portal.",
    formatValue: (v) => ({
      display: v ? "Verified 'Study in Saudi' Partner" : "Direct Admission Only",
      isPositive: Boolean(v),
    }),
  },

  // === South Korea ===
  d10_job_seeker_stay_back_duration: {
    label: "D-10 Job Seeker Visa Duration",
    category: "visa",
    tooltip: "Permitted duration under Korea's D-10 job search visa upon graduation.",
    formatValue: (v) => ({
      display: v ? String(v) : "Up to 2 Years Post-Graduation",
      isPositive: true,
    }),
  },
  gks_kgsp_eligible: {
    label: "GKS / KGSP Scholarship Eligible",
    category: "scholarship",
    tooltip: "Designated partner university for Global Korea Scholarship (100% tuition, airfare, settlement & monthly stipend).",
    formatValue: (v) => ({
      display: v ? "Eligible (Full Ride + KRW 1,000,000/mo Stipend)" : "Not Eligible",
      isPositive: Boolean(v),
    }),
  },
  ieqas_certification_status: {
    label: "IEQAS Certified (Fast-Track Visa)",
    category: "academics",
    tooltip: "International Education Quality Assurance System certification, granting expedited visa processing.",
    formatValue: (v) => ({
      display: v ? "Certified (Fast-Track Visa Issuance)" : "Standard Review",
      isPositive: Boolean(v),
    }),
  },
  korean_language_institute_available: {
    label: "On-Campus Korean Language Institute",
    category: "language",
    tooltip: "Affiliated Korean Language Institute (KLI) offering intensive 1-year language tracks.",
    formatValue: (v) => ({
      display: v ? "On-Campus KLI Immersion Available" : "No Direct Language Institute",
      isPositive: Boolean(v),
    }),
  },
  topik_requirement_or_prep: {
    label: "TOPIK Level Requirement",
    category: "language",
    tooltip: "Required Test of Proficiency in Korean (TOPIK) level or preparatory waiver policy.",
    formatValue: (v) => ({
      display: v ? String(v) : "TOPIK 3+ or English Track",
      isPositive: true,
    }),
  },

  // === Türkiye ===
  denklik_diploma_equivalency_required: {
    label: "Denklik Diploma Equivalency",
    category: "academics",
    tooltip: "Requires diploma equivalency certificate (Denklik Belgesi) from Turkish Ministry of National Education or YÖK.",
    formatValue: (v) => ({
      display: v ? "Denklik Equivalency Required" : "Direct Document Review",
      isPositive: !v,
    }),
  },
  language_of_instruction_ratio: {
    label: "Language of Instruction Ratio",
    category: "language",
    tooltip: "Breakdown of instruction between English and Turkish (e.g. 100% English, 30% English / 70% Turkish).",
    formatValue: (v) => ({
      display: v ? String(v) : "100% English Available",
      isPositive: true,
    }),
  },
  tomer_turkish_prep_year_offered: {
    label: "TÖMER Turkish Prep Year",
    category: "language",
    tooltip: "Offers certified TÖMER Turkish language preparatory program before starting academic courses.",
    formatValue: (v) => ({
      display: v ? "1-Year TÖMER Prep Year Offered" : "Direct Entry",
      isPositive: Boolean(v),
    }),
  },
  turkiye_burslari_ytb_eligible: {
    label: "Türkiye Bursları (YTB) Eligible",
    category: "scholarship",
    tooltip: "Eligible for Türkiye Scholarships (full tuition, dorm, monthly stipend, flight, and health insurance).",
    formatValue: (v) => ({
      display: v ? "Eligible (Full Ride + Dorm + Monthly Stipend)" : "Self-Funded Only",
      isPositive: Boolean(v),
    }),
  },
  yos_or_tr_yos_accepted: {
    label: "TR-YÖS / YÖS Exam Accepted",
    category: "language",
    tooltip: "Accepts Turkish Foreign Students Examination (TR-YÖS) for undergraduate admissions.",
    formatValue: (v) => ({
      display: v ? "Accepted for Direct Admission" : "High School Diploma Review",
      isPositive: Boolean(v),
    }),
  },

  // === United States ===
  need_blind: {
    label: "Financial Need Policy",
    category: "scholarship",
    tooltip: "Need-Blind admission means your ability to pay tuition does not impact your admissions decision.",
    formatValue: (v) => ({
      display: v ? "Need-Blind Admission (Full Need Met)" : "Need-Aware Admission",
      isPositive: Boolean(v),
    }),
  },
  sat_required: {
    label: "SAT / ACT Requirement",
    category: "language",
    tooltip: "Whether SAT or ACT standardized test scores are mandatory for admission.",
    formatValue: (v) => ({
      display: v ? "Standardized Tests Required" : "Test-Optional / Waived",
      isPositive: !v,
    }),
  },

  // === Mauritius ===
  mass_scholarship_eligible: {
    label: "MASS Scholarship Eligible",
    category: "scholarship",
    tooltip: "Eligible for Mauritius-Africa Scholarship Scheme (full tuition waiver & living allowance).",
    formatValue: (v) => ({
      display: v ? "MASS African Scholarship Eligible" : "Self-Funded Only",
      isPositive: Boolean(v),
    }),
  },
  hec_accredited: {
    label: "HEC Accreditation",
    category: "academics",
    tooltip: "Accredited by the Higher Education Commission of Mauritius.",
    formatValue: (v) => ({
      display: v ? "HEC Accredited Institution" : "Standard Registration",
      isPositive: Boolean(v),
    }),
  },
  ypop_stay_back_eligible: {
    label: "YPOP Stay-Back Eligible",
    category: "visa",
    tooltip: "Eligible for Young Professional Occupation Permit (YPOP) for up to 3 years work rights.",
    formatValue: (v) => ({
      display: v ? "Up to 3-Year YPOP Stay-Back Work Permit" : "Standard Visa Rules",
      isPositive: Boolean(v),
    }),
  },
  awarding_body_parent_institution: {
    label: "Awarding Parent Institution",
    category: "academics",
    tooltip: "Degrees accredited or awarded in partnership with UK/French/international universities.",
    formatValue: (v) => ({
      display: v ? String(v) : "Autonomous Degree",
      isPositive: true,
    }),
  },
  language_of_instruction: {
    label: "Language of Instruction",
    category: "language",
    tooltip: "Primary language used in lectures and coursework.",
    formatValue: (v) => ({
      display: v ? String(v) : "English Medium",
      isPositive: true,
    }),
  },
};

/**
 * Normalizes all policies for a university, taking values from university_policies jsonb
 * and falling back to legacy top-level attributes where appropriate.
 */
export function getNormalizedPolicies(university: University): Record<string, any> {
  const policies = { ...(university.university_policies || {}) };

  // Fallback for US attributes if still at top-level
  if (policies.need_blind === undefined && university.need_blind !== undefined && university.need_blind !== null) {
    policies.need_blind = university.need_blind;
  }
  if (policies.sat_required === undefined && university.sat_required !== undefined && university.sat_required !== null) {
    policies.sat_required = university.sat_required;
  }

  return policies;
}

/**
 * Calculates the flagship highlight badge for a university card based on country & prestige rules
 */
export function getFlagshipBadge(university: University): FlagshipBadge | null {
  const country = (university.country_located || "").toLowerCase();
  const policies = getNormalizedPolicies(university);

  // 1. United States
  if (country.includes("united states") || country.includes("usa") || country.includes("us")) {
    if (policies.need_blind === true) {
      return { label: "Need-Blind Admission", variant: "emerald" };
    }
    if (policies.sat_required === false) {
      return { label: "Test-Optional Policy", variant: "blue" };
    }
    if (policies.need_blind === false) {
      return { label: "Need-Aware Admission", variant: "zinc" };
    }
  }

  // 2. India
  if (country.includes("india")) {
    if (policies.iccr_scholarship_eligible) {
      return { label: "ICCR Scholarship Eligible", variant: "gold" };
    }
    if (policies.medium_of_instruction_certificate_accepted) {
      return { label: "MOI Certificate Accepted", variant: "blue" };
    }
    if (policies.study_in_india_code) {
      return { label: "Study in India Partner", variant: "emerald" };
    }
  }

  // 3. China
  if (country.includes("china")) {
    if (policies.c9_league_member) {
      return { label: "C9 League Elite", variant: "purple" };
    }
    if (policies.csc_scholarship_supported) {
      return { label: "CSC Scholarship Supported", variant: "gold" };
    }
    if (policies.double_first_class) {
      return { label: "Double First Class", variant: "blue" };
    }
    if (policies.english_taught_degrees_offered) {
      return { label: "English-Taught Tracks", variant: "emerald" };
    }
  }

  // 4. Saudi Arabia
  if (country.includes("saudi")) {
    if (policies.royal_scholarship_stipend_monthly || policies.flight_tickets_provided || policies.campus_housing_provided) {
      return { label: "100% Ride (Stipend + Flights)", variant: "gold" };
    }
    if (policies.study_in_saudi_portal_listed) {
      return { label: "Study in Saudi Partner", variant: "emerald" };
    }
  }

  // 5. Italy
  if (country.includes("italy")) {
    if (policies.dsu_regional_scholarship_board || policies.isee_parificato_eligible) {
      return { label: "DSU Regional Aid Eligible", variant: "gold" };
    }
    if (policies.post_study_work_stay_back_months) {
      return { label: `${policies.post_study_work_stay_back_months}-Mo Stay-Back Visa`, variant: "blue" };
    }
    if (policies.universitaly_pre_enrollment_required) {
      return { label: "Universitaly Enrolled", variant: "emerald" };
    }
  }

  // 6. Japan
  if (country.includes("japan")) {
    if (policies.mext_scholarship_recommendations) {
      return { label: "MEXT Partner (Full Ride)", variant: "gold" };
    }
    if (policies.sgu_top_global_status) {
      return { label: "SGU Top Global Status", variant: "purple" };
    }
    if (policies.part_time_work_hours_per_week) {
      return { label: `${policies.part_time_work_hours_per_week}h/Wk Work Permitted`, variant: "emerald" };
    }
  }

  // 7. South Korea
  if (country.includes("korea")) {
    if (policies.gks_kgsp_eligible) {
      return { label: "GKS / KGSP Eligible", variant: "gold" };
    }
    if (policies.ieqas_certification_status) {
      return { label: "IEQAS Fast-Track Visa", variant: "emerald" };
    }
    if (policies.d10_job_seeker_stay_back_duration) {
      return { label: `D-10 Stay-Back: ${policies.d10_job_seeker_stay_back_duration}`, variant: "blue" };
    }
  }

  // 8. Türkiye
  if (country.includes("türkiye") || country.includes("turkey")) {
    if (policies.turkiye_burslari_ytb_eligible) {
      return { label: "Türkiye Bursları (YTB) Eligible", variant: "gold" };
    }
    if (policies.tomer_turkish_prep_year_offered) {
      return { label: "TÖMER Prep Year Offered", variant: "emerald" };
    }
    if (policies.yos_or_tr_yos_accepted) {
      return { label: "TR-YÖS Exam Accepted", variant: "blue" };
    }
  }

  // 9. Romania
  if (country.includes("romania")) {
    if (policies.mae_romanian_mfa_scholarship_eligible) {
      return { label: "MAE MFA Scholarship Eligible", variant: "gold" };
    }
    if (policies.eu_recognized_medical_degree) {
      return { label: "EU-Recognized Medical Degree", variant: "purple" };
    }
    if (policies.preparatory_year_romanian_offered) {
      return { label: "Romanian Prep Year Offered", variant: "blue" };
    }
  }

  // 10. Mauritius
  if (country.includes("mauritius")) {
    if (policies.mass_scholarship_eligible) {
      return { label: "MASS Scholarship Eligible", variant: "gold" };
    }
    if (policies.ypop_stay_back_eligible) {
      return { label: "YPOP Stay-Back Work Permit", variant: "emerald" };
    }
  }

  // Fallback: Check for generic high-value policies
  if (university.tuition_waiver_threshold !== null && university.tuition_waiver_threshold !== undefined && university.tuition_waiver_threshold > 0) {
    return { label: `Up to $${university.tuition_waiver_threshold.toLocaleString()} Waiver`, variant: "gold" };
  }

  return null;
}

/**
 * Returns categorized policy items for the university details page
 */
export function getGroupedPolicies(university: University): PolicyGroup[] {
  const policies = getNormalizedPolicies(university);
  const formattedItems: FormattedPolicyItem[] = [];

  for (const [key, val] of Object.entries(policies)) {
    if (val === null || val === undefined || val === "") continue;

    const meta = POLICY_METADATA[key];
    if (meta) {
      const formatted = meta.formatValue
        ? meta.formatValue(val)
        : { display: String(val), isPositive: Boolean(val) };

      formattedItems.push({
        key,
        label: meta.label,
        valueDisplay: formatted.display,
        category: meta.category,
        isPositive: formatted.isPositive,
        tooltip: meta.tooltip,
      });
    }
  }

  const groups: PolicyGroup[] = [
    {
      id: "scholarship",
      title: "Government Scholarships & Financial Aid",
      description: "National bilateral awards, regional grants, stipends, and housing support.",
      items: formattedItems.filter((i) => i.category === "scholarship"),
    },
    {
      id: "visa",
      title: "Visa, Immigration & Stay-Back Rights",
      description: "Student sponsorship, post-study work authorization, and work rights.",
      items: formattedItems.filter((i) => i.category === "visa"),
    },
    {
      id: "academics",
      title: "Institutional Accreditation & Elite Standing",
      description: "National rankings, ministry approvals, international treaty recognition, and consortiums.",
      items: formattedItems.filter((i) => i.category === "academics"),
    },
    {
      id: "language",
      title: "Language Pathways & Entrance Testing",
      description: "Preparatory immersion years, MOI certificates, and standardized entrance examinations.",
      items: formattedItems.filter((i) => i.category === "language"),
    },
  ];

  // Return only groups that have at least one active item
  return groups.filter((g) => g.items.length > 0);
}
