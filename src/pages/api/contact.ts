import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const first_name = formData.get("first_name")?.toString().trim() ?? "";
  const last_name = formData.get("last_name")?.toString().trim() ?? "";
  const company = formData.get("company_name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const message = formData.get("comment")?.toString().trim() ?? "";

  const { error } = await supabaseAdmin.from("contact_submissions").insert({
    first_name,
    last_name,
    company,
    email,
    message,
  });

  if (error) {
    return redirect("/forms/contact?error=1");
  }

  return redirect("/forms/contact?success=1");
};
