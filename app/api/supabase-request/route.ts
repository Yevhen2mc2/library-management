import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("books").select("*").limit(1);

    if (error) {
      console.error("Supabase ping error:", error);
      return NextResponse.json(
        { error: "Failed to ping Supabase" },
        { status: 500 },
      );
    }

    console.log("Supabase ping successful:", new Date().toISOString());
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Supabase connection maintained successfully",
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
