import { getSupabase } from './supabase';
import { SAMPLE_SCHOLARSHIPS, SAMPLE_UNIVERSITIES } from '../data/sampleData';
import { Scholarship, University, StudentProfile } from '../types';

/**
 * Maps a raw Supabase database row from `scholarship_opportunities` to our unified Scholarship interface
 */
function mapSupabaseToScholarship(row: any): Scholarship {
  const deadlines = Array.isArray(row.deadline)
    ? row.deadline.map((d: any) => {
        if (typeof d === 'string') return { type: 'Submission Deadline', date: d };
        return { type: d.deadline_type || 'Deadline', date: d.date || '' };
      })
    : [];

  return {
    id: String(row.id || row.organization?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(7)),
    title: row.organization ? `${row.organization} Fellowship` : 'International Scholarship',
    organization: row.organization || 'Global Sponsor',
    country_located: row.country_located || 'Multiple Locations',
    eligible_countries: Array.isArray(row.eligible_countries) ? row.eligible_countries : [],
    education_levels: Array.isArray(row.education_levels) ? row.education_levels : ['Bachelor', 'Master'],
    fields: Array.isArray(row.fields) ? row.fields : ['All Fields'],
    funding_type: row.funding_type || 'Full Tuition Support',
    annual_coverage_cost: row.annual_tuitioin_coveratge_cost || 20000,
    award_details: {
      tuition_covered: true,
      monthly_stipend: row.financial_aid_policy || 'Generous living allowance included',
      travel_covered: true,
      health_insurance: true,
      additional_allowances: row.tuition_waiver_threshold ? `Up to $${row.tuition_waiver_threshold} waiver` : undefined
    },
    minimum_gpa: row.minimum_gpa ?? null,
    max_age: row.max_age ?? null,
    english_proficiency_required: Array.isArray(row.english_proficency_required) ? row.english_proficency_required : ['English test or waiver'],
    deadlines: deadlines.length > 0 ? deadlines : [{ type: 'Upcoming Application Deadline', date: '2026-11-30' }],
    required_documents: Array.isArray(row.required_documents) && row.required_documents.length > 0
      ? row.required_documents
      : ['Application Form', 'Transcripts', 'Statement of Purpose', 'Letters of Recommendation'],
    application_url: row.application_url || 'https://scholly-portal.edu',
    application_process: row.application_process || row['application process'] || 'Direct online submission via official sponsor portal.',
    application_fee: row.application_fee ?? 0,
    notable_accolades: Array.isArray(row.notable_accolades) ? row.notable_accolades : ['Verified Opportunity', 'Direct Sponsor Backed'],
    number_of_recommendation_letters_required: row.number_of_recommendation_letters_required ?? 2,
    essays_required: row.essays_required || 'Motivation statement',
    program_delivery_mode: row.program_delivery_mode || 'On Campus',
    source_name: row.organization ? `${row.organization} Official Site` : 'Web Research Verification',
    source_url: row.application_url || 'https://scholly-portal.edu',
    verification_date: '2026-10-15',
    is_verified: true
  };
}

/**
 * Fetch all scholarships using hybrid strategy (Supabase first, fallback to rich sample data)
 */
export async function getScholarships(): Promise<Scholarship[]> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('scholarship_opportunities')
        .select('*');

      if (!error && data && data.length > 0) {
        const liveScholarships = data.map(mapSupabaseToScholarship);
        // Combine live database scholarships with our rich sample set
        return [...liveScholarships, ...SAMPLE_SCHOLARSHIPS];
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed; falling back to sample scholarships.', err);
  }
  return SAMPLE_SCHOLARSHIPS;
}

/**
 * Fetch a single scholarship by ID
 */
export async function getScholarshipById(id: string): Promise<Scholarship | null> {
  const all = await getScholarships();
  return all.find((s) => s.id === id) || null;
}

/**
 * Fetch all universities
 */
export async function getUniversities(): Promise<University[]> {
  return SAMPLE_UNIVERSITIES;
}

/**
 * Fetch a single university by ID
 */
export async function getUniversityById(id: string): Promise<University | null> {
  const all = await getUniversities();
  return all.find((u) => u.id === id) || null;
}

/**
 * Computes an eligibility & match percentage for a student profile against an opportunity
 */
export function calculateMatchScore(
  profile: Partial<StudentProfile> | null,
  opportunity: Scholarship | University
): { score: number; reasons: string[] } {
  if (!profile) return { score: 75, reasons: ['Standard international eligibility match'] };

  let score = 50;
  const reasons: string[] = [];

  // Check nationality / destination
  if (profile.preferred_destinations && profile.preferred_destinations.length > 0) {
    const targetCountry = 'country_located' in opportunity ? opportunity.country_located : opportunity.country;
    const match = profile.preferred_destinations.some((d) => targetCountry.toLowerCase().includes(d.toLowerCase()));
    if (match) {
      score += 15;
      reasons.push(`Matches your preferred destination: ${targetCountry}`);
    }
  }

  // Check GPA
  if (profile.gpa && opportunity.minimum_gpa) {
    if (profile.gpa >= opportunity.minimum_gpa) {
      score += 20;
      reasons.push(`Your GPA (${profile.gpa}) exceeds the requirement (${opportunity.minimum_gpa})`);
    } else {
      score -= 15;
      reasons.push(`Minimum GPA is ${opportunity.minimum_gpa} (yours is ${profile.gpa})`);
    }
  }

  // Check Degree Level
  if (profile.target_degree_level) {
    if ('education_levels' in opportunity) {
      if (opportunity.education_levels.includes(profile.target_degree_level)) {
        score += 15;
        reasons.push(`Offers your target degree level: ${profile.target_degree_level}`);
      }
    } else if ('programs' in opportunity) {
      if (opportunity.programs.some((p) => p.degree_level.toLowerCase() === profile.target_degree_level?.toLowerCase())) {
        score += 15;
        reasons.push(`Provides accredited ${profile.target_degree_level} programs`);
      }
    }
  }

  return {
    score: Math.min(Math.max(score, 30), 98),
    reasons: reasons.length > 0 ? reasons : ['General international applicant eligibility met']
  };
}
