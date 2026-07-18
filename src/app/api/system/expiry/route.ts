import { NextResponse } from "next/server"
import { runExpirySweep } from "@/jobs/expireOffersAndJobs"

export async function GET() {
  const result = await runExpirySweep()
  return NextResponse.json(result)
}
