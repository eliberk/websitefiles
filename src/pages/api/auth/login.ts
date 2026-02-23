import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return redirect("/forms/login?error=1");
  }

  const { access_token, refresh_token } = data.session;

  cookies.set("sb-access-token", access_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return redirect("/dashboard/contacts");
};
