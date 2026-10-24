"use client";

import { useState, useEffect } from "react";
import {
  FormData,
  getEmptyFormData,
  formDataToSupabase,
  fastAPIToFormData,
  FastAPIScholarship,
} from "./types";

export default function AdminPage() {
  const [formData, setFormData] = useState<FormData>(getEmptyFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    const fetchFastAPIData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/previous_results");
        if (!response.ok) {
          throw new Error("Failed to fetch from FastAPI");
        }
        const data: FastAPIScholarship = await response.json();
        setFormData(fastAPIToFormData(data));
        setHasFetchedData(true);
      } catch (err) {
        console.error("FastAPI fetch error:", err);
        // Continue with empty form if fetch fails
      } finally {
        setIsFetching(false);
      }
    };

    fetchFastAPIData();
  }, []);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabaseData = formDataToSupabase(formData);
      const response = await fetch("/api/scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supabaseData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save scholarship");
      }

      setSuccess(true);
      setFormData(getEmptyFormData());
      setHasFetchedData(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(getEmptyFormData());
    setHasFetchedData(false);
    setError(null);
    setSuccess(false);
  };

  const inputClass =
    "w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";
  const sectionClass =
    "mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-700 last:border-0 last:pb-0";
  const textareaClass = `${inputClass} min-h-[80px] resize-y`;

  if (isFetching) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Loading scholarship data from FastAPI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {hasFetchedData
                ? "Edit Scholarship Opportunity"
                : "Add Scholarship Opportunity"}
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {hasFetchedData
                ? "Review and modify the data fetched from FastAPI, then save to Supabase."
                : "Fill in the details below to create a new scholarship entry in the database."}
            </p>
          </div>
          {hasFetchedData && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
            >
              Start New Entry
            </button>
          )}
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-300">
              Scholarship saved successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className={sectionClass}>
            <legend className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Basic Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="organization" className={labelClass}>
                  Organization *
                </label>
                <input
                  type="text"
                  id="organization"
                  className={inputClass}
                  value={formData.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  placeholder="e.g., Fulbright Commission"
                  required
                />
              </div>
              <div>
                <label htmlFor="country_located" className={labelClass}>
                  Country Located
                </label>
                <input
                  type="text"
                  id="country_located"
                  className={inputClass}
                  value={formData.country_located}
                  onChange={(e) =>
                    handleChange("country_located", e.target.value)
                  }
                  placeholder="e.g., United States"
                />
              </div>
              <div>
                <label htmlFor="university_type" className={labelClass}>
                  University Type
                </label>
                <input
                  type="text"
                  id="university_type"
                  className={inputClass}
                  value={formData.university_type}
                  onChange={(e) =>
                    handleChange("university_type", e.target.value)
                  }
                  placeholder="e.g., Public, Private, Non-profit"
                />
              </div>
              <div>
                <label htmlFor="funding_type" className={labelClass}>
                  Funding Type
                </label>
                <input
                  type="text"
                  id="funding_type"
                  className={inputClass}
                  value={formData.funding_type}
                  onChange={(e) => handleChange("funding_type", e.target.value)}
                  placeholder="e.g., Full, Partial, Tuition-only"
                />
              </div>
              <div>
                <label htmlFor="program_delivery_mode" className={labelClass}>
                  Program Delivery Mode
                </label>
                <input
                  type="text"
                  id="program_delivery_mode"
                  className={inputClass}
                  value={formData.program_delivery_mode}
                  onChange={(e) =>
                    handleChange("program_delivery_mode", e.target.value)
                  }
                  placeholder="e.g., On-campus, Online, Hybrid"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Academic Requirements
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="education_levels" className={labelClass}>
                  Education Levels (comma-separated)
                </label>
                <input
                  type="text"
                  id="education_levels"
                  className={inputClass}
                  value={formData.education_levels}
                  onChange={(e) =>
                    handleChange("education_levels", e.target.value)
                  }
                  placeholder="e.g., Bachelor's, Master's, PhD"
                />
              </div>
              <div>
                <label htmlFor="fields" className={labelClass}>
                  Fields of Study (comma-separated)
                </label>
                <input
                  type="text"
                  id="fields"
                  className={inputClass}
                  value={formData.fields}
                  onChange={(e) => handleChange("fields", e.target.value)}
                  placeholder="e.g., Computer Science, Engineering, Arts"
                />
              </div>
              <div>
                <label htmlFor="minimum_gpa" className={labelClass}>
                  Minimum GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  id="minimum_gpa"
                  className={inputClass}
                  value={formData.minimum_gpa}
                  onChange={(e) => handleChange("minimum_gpa", e.target.value)}
                  placeholder="e.g., 3.5"
                />
              </div>
              <div>
                <label
                  htmlFor="minimum_standardized_test_scores"
                  className={labelClass}
                >
                  Min. Standardized Test Scores (comma-separated)
                </label>
                <input
                  type="text"
                  id="minimum_standardized_test_scores"
                  className={inputClass}
                  value={formData.minimum_standardized_test_scores}
                  onChange={(e) =>
                    handleChange(
                      "minimum_standardized_test_scores",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., GRE 320, TOEFL 100, IELTS 7.0"
                />
              </div>
              <div>
                <label
                  htmlFor="english_proficency_required"
                  className={labelClass}
                >
                  English Proficiency Required (comma-separated)
                </label>
                <input
                  type="text"
                  id="english_proficency_required"
                  className={inputClass}
                  value={formData.english_proficency_required}
                  onChange={(e) =>
                    handleChange("english_proficency_required", e.target.value)
                  }
                  placeholder="e.g., TOEFL, IELTS, Duolingo"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Eligibility
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eligible_countries" className={labelClass}>
                  Eligible Countries (comma-separated)
                </label>
                <input
                  type="text"
                  id="eligible_countries"
                  className={inputClass}
                  value={formData.eligible_countries}
                  onChange={(e) =>
                    handleChange("eligible_countries", e.target.value)
                  }
                  placeholder="e.g., United States, Canada, United Kingdom"
                />
              </div>
              <div>
                <label htmlFor="max_age" className={labelClass}>
                  Maximum Age
                </label>
                <input
                  type="number"
                  min="0"
                  id="max_age"
                  className={inputClass}
                  value={formData.max_age}
                  onChange={(e) => handleChange("max_age", e.target.value)}
                  placeholder="e.g., 35"
                />
              </div>
              <div>
                <label htmlFor="age_restrictions" className={labelClass}>
                  Age Restrictions
                </label>
                <input
                  type="text"
                  id="age_restrictions"
                  className={inputClass}
                  value={formData.age_restrictions}
                  onChange={(e) =>
                    handleChange("age_restrictions", e.target.value)
                  }
                  placeholder="e.g., No restrictions, Under 30"
                />
              </div>
              <div>
                <label
                  htmlFor="international_student_population"
                  className={labelClass}
                >
                  International Student Population
                </label>
                <input
                  type="number"
                  min="0"
                  id="international_student_population"
                  className={inputClass}
                  value={formData.international_student_population}
                  onChange={(e) =>
                    handleChange(
                      "international_student_population",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Application Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="application_url" className={labelClass}>
                  Application URL
                </label>
                <input
                  type="url"
                  id="application_url"
                  className={inputClass}
                  value={formData.application_url}
                  onChange={(e) =>
                    handleChange("application_url", e.target.value)
                  }
                  placeholder="https://example.com/apply"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="application_process" className={labelClass}>
                  Application Process
                </label>
                <textarea
                  id="application_process"
                  className={textareaClass}
                  value={formData.application_process}
                  onChange={(e) =>
                    handleChange("application_process", e.target.value)
                  }
                  placeholder="Describe the application process steps..."
                />
              </div>
              <div>
                <label htmlFor="deadline" className={labelClass}>
                  Deadline(s) (comma-separated)
                </label>
                <input
                  type="text"
                  id="deadline"
                  className={inputClass}
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  placeholder="e.g., 2024-12-31, 2025-03-15"
                />
              </div>
              <div>
                <label htmlFor="required_documents" className={labelClass}>
                  Required Documents (comma-separated)
                </label>
                <textarea
                  id="required_documents"
                  className={inputClass}
                  value={formData.required_documents}
                  onChange={(e) =>
                    handleChange("required_documents", e.target.value)
                  }
                  placeholder="e.g., Transcript, CV, Personal Statement, Letters of Recommendation"
                />
              </div>
              <div>
                <label
                  htmlFor="accepted_application_platform"
                  className={labelClass}
                >
                  Accepted Application Platforms (comma-separated)
                </label>
                <input
                  type="text"
                  id="accepted_application_platform"
                  className={inputClass}
                  value={formData.accepted_application_platform}
                  onChange={(e) =>
                    handleChange(
                      "accepted_application_platform",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., Common App, Coalition, Direct"
                />
              </div>
              <div>
                <label htmlFor="application_fee" className={labelClass}>
                  Application Fee
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="application_fee"
                  className={inputClass}
                  value={formData.application_fee}
                  onChange={(e) =>
                    handleChange("application_fee", e.target.value)
                  }
                  placeholder="e.g., 75.00"
                />
              </div>
              <div>
                <label
                  htmlFor="number_of_recommendation_letters_required"
                  className={labelClass}
                >
                  Number of Recommendation Letters Required
                </label>
                <input
                  type="number"
                  min="0"
                  id="number_of_recommendation_letters_required"
                  className={inputClass}
                  value={formData.number_of_recommendation_letters_required}
                  onChange={(e) =>
                    handleChange(
                      "number_of_recommendation_letters_required",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label
                  htmlFor="recommendation_letter_types"
                  className={labelClass}
                >
                  Recommendation Letter Types
                </label>
                <input
                  type="text"
                  id="recommendation_letter_types"
                  className={inputClass}
                  value={formData.recommendation_letter_types}
                  onChange={(e) =>
                    handleChange("recommendation_letter_types", e.target.value)
                  }
                  placeholder="e.g., Academic, Professional, Character"
                />
              </div>
              <div className="flex items-center">
                <textarea
                  id="essays_required"
                  className={inputClass}
                  value={formData.essays_required}
                  onChange={(e) =>
                    handleChange("essays_required", e.target.value)
                  }
                />
                <label
                  htmlFor="essays_required"
                  className="ml-2 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  Essays Required
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Financial Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="financial_aid_policy" className={labelClass}>
                  Financial Aid Policy
                </label>
                <textarea
                  id="financial_aid_policy"
                  className={textareaClass}
                  value={formData.financial_aid_policy}
                  onChange={(e) =>
                    handleChange("financial_aid_policy", e.target.value)
                  }
                  placeholder="Describe the financial aid policy..."
                />
              </div>
              <div>
                <label
                  htmlFor="tuition_waiver_threshold"
                  className={labelClass}
                >
                  Tuition Waiver Threshold
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="tuition_waiver_threshold"
                  className={inputClass}
                  value={formData.tuition_waiver_threshold}
                  onChange={(e) =>
                    handleChange("tuition_waiver_threshold", e.target.value)
                  }
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label
                  htmlFor="annual_tuitioin_coveratge_cost"
                  className={labelClass}
                >
                  Annual Tuition Coverage Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="annual_tuitioin_coveratge_cost"
                  className={inputClass}
                  value={formData.annual_tuitioin_coveratge_cost}
                  onChange={(e) =>
                    handleChange(
                      "annual_tuitioin_coveratge_cost",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., 30000"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Additional Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="notable_accolades" className={labelClass}>
                  Notable Accolades (comma-separated)
                </label>
                <input
                  type="text"
                  id="notable_accolades"
                  className={inputClass}
                  value={formData.notable_accolades}
                  onChange={(e) =>
                    handleChange("notable_accolades", e.target.value)
                  }
                  placeholder="e.g., Nobel Laureates, Top 10 Ranking"
                />
              </div>
              <div>
                <label htmlFor="campus_locations" className={labelClass}>
                  Campus Locations (comma-separated)
                </label>
                <input
                  type="text"
                  id="campus_locations"
                  className={inputClass}
                  value={formData.campus_locations}
                  onChange={(e) =>
                    handleChange("campus_locations", e.target.value)
                  }
                  placeholder="e.g., Main Campus, Downtown Campus, Online"
                />
              </div>
              <div>
                <label
                  htmlFor="school_year_starting_date"
                  className={labelClass}
                >
                  School Year Starting Date
                </label>
                <input
                  type="text"
                  id="school_year_starting_date"
                  className={inputClass}
                  value={formData.school_year_starting_date}
                  onChange={(e) =>
                    handleChange("school_year_starting_date", e.target.value)
                  }
                  placeholder="e.g., September 2024"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save to Supabase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
