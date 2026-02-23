import { defineMiddleware } from "astro:middleware";
import { supabase } from "@/lib/supabase";

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  if (!url.pathname.startsWith("/dashboard")) {
    return next();
  }

  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) {
    return redirect("/forms/login");
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect("/forms/login");
  }

  return next();
});
