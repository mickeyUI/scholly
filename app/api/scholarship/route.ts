import { NextRequest } from "next/server";
import { POST as universitiesPost } from "../universities/route";

/**
 * Backward-compatibility proxy: forwards requests to /api/universities
 */
export async function POST(request: NextRequest) {
  return universitiesPost(request);
}
