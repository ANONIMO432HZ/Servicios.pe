import { ao as defineMiddleware, bf as sequence } from './chunks/params-and-props_CvnwIJai.mjs';
import 'piccolore';
import 'clsx';

const onRequest$1 = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;
  const isLoginPage = url.pathname === "/login";
  const hasToken = cookies.has("auth_token");
  if (url.pathname.startsWith("/api") || url.pathname.includes(".") || url.pathname.startsWith("/ASSETS")) {
    return next();
  }
  if (!hasToken && !isLoginPage) {
    cookies.set("auth_token", "guest-session-token", {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24
      // 1 día
    });
    return next();
  }
  if (hasToken && isLoginPage) {
    const token = cookies.get("auth_token")?.value;
    if (token !== "guest-session-token") {
      return redirect("/");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
