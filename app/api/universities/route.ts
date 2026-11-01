import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../lib/supabase";
import { SupabaseUniversity, Deadline } from "../../Admin/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const university: SupabaseUniversity = body.supaUni || body.university;
    const deadlines: Deadline[] = body.supaDline || body.deadlines || [];
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    if (!university) {
      return NextResponse.json(
        { success: false, error: "University data is missing" },
        { status: 400 }
      );
    }

    let uniId = "";
    try {
      const { data, error } = await supabase
        .from("universities")
        .insert([university])
        .select()
        .single();

      if (error) throw error;
      uniId = data.id;
    } catch (error: any) {
      console.error("Universities insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to insert university" },
        { status: 500 }
      );
    }

    if (deadlines.length > 0 && uniId) {
      const deadlinesWithId = deadlines.map((dl) => ({
        university_id: uniId,
        deadline_type: dl.deadline_type,
        deadline_date: dl.date,
      }));

      try {
        const { error: dlError } = await supabase
          .from("university_deadlines")
          .insert(deadlinesWithId);
        if (dlError) console.error("Deadlines insert warning:", dlError);
      } catch (dlErr) {
        console.error("Deadlines insert exception:", dlErr);
      }
    }

    return NextResponse.json({ success: true, id: uniId });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
