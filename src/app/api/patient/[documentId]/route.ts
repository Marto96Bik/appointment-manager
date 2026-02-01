import { NextRequest, NextResponse } from "next/server";
import { logger } from "../../../../lib/logger";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {}
