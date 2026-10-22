import { NextRequest } from "next/server";
import { POST as universalPost } from "../convert-file/route";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return universalPost(req);
}
