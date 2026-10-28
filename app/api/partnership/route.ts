import { handleEnquiry } from "@/lib/enquiries/handler";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleEnquiry(request, "partnership");
}
