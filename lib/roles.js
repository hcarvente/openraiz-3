// Who is signed in, and what they may do. Server-only: it reads the Neon Auth session and the database.
// The pure rules (who counts as admin, which roles exist) live in lib/rolesCore.js so they can be tested.
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/rolesCore";

// The signed-in person, their saved profile (null if it was never created) and what they may do, or null when
// nobody is signed in. Admin = a verified email on the ADMIN_EMAILS list (see isAdminEmail).
export async function getCurrentUser() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) return null;

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  return {
    user,
    profile,
    isVerified: user.emailVerified === true,
    isAdmin: isAdminEmail(user.email, user.emailVerified, process.env.ADMIN_EMAILS),
  };
}

// For API routes that only the admin may use. Returns null when the caller is allowed; otherwise returns the
// response to send back: 401 (not signed in), 403 (signed in but not admin) or 503 (the sign-in service failed).
// It fails closed: any error means "no".
export async function requireAdminApi() {
  let current;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return Response.json({ error: "Sign-in is unavailable right now." }, { status: 503 });
  }
  if (!current) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!current.isAdmin) return Response.json({ error: "Not allowed." }, { status: 403 });
  return null;
}
