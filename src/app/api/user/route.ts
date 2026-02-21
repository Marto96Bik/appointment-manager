import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "./user.service";

export async function GET(req: NextRequest) {
  const users = getUsers();
  return NextResponse.json(users);
}
