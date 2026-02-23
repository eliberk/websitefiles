import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();

  const first_name = formData.get("first_name")?.toString().trim() ?? "";
  const last_name = formData.get("last_name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name, last_name },
    },
  });

  if (error) {
    return redirect("/forms/signup?error=1");
  }

  // If email confirmation is required, session will be null
  if (!data.session) {
    return redirect("/forms/login?confirm=1");
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
