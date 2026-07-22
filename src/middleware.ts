import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define routes that should require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // Add your protected routes here
  "/forum(.*)",     // Example: add any route you want to lock down
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Protect only the routes defined above
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webp|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};