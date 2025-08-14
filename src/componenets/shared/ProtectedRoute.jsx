// src/components/shared/ProtectedRoute.jsx  (Outlet version)

// We import helpers from React Router:
// - Navigate: to redirect
// - Outlet:   placeholder where matched nested routes render
// - useLocation: lets us remember where the user tried to go (so we can send them back after login)
import { Navigate, Outlet, useLocation } from "react-router-dom";

// useAuth is our custom hook from the single source of truth AuthContext.
// IMPORTANT: this must point to the SAME file everywhere in the app.
import { useAuth } from "../../firebase/AuthContext";

/*
  The ({ allow, children }) syntax means we’re receiving props from
  wherever <ProtectedRoute /> is used, and we’re **object-destructuring**
  them right in the parameter list:
    function ProtectedRoute(props) { const allow = props.allow; const children = props.children; }
  is the same as:
    function ProtectedRoute({ allow, children }) { ... }
*/
export default function ProtectedRoute({ allow, children }) {
  // useAuth() returns an object (e.g., { user, loading, login, logout }).
  // This is **object destructuring** again: we pull out only what we need.
  // - user:   the logged-in user's data (like email, uid, role)
  // - loading: true while Firebase/AuthContext is still figuring out if a user is logged in
  const { user, loading } = useAuth();

  // useLocation() gives us the current URL info (pathname, search, etc.).
  // Example loc: { pathname: "/coach/profile", search: "", hash: "", state: null, key: "abc123" }
  // We use this so if a user hits a protected page while not logged in,
  // we can remember where they were going and send them there after they log in.
  const loc = useLocation();

  // While loading is true, **don’t render anything** (prevents flashing the page or redirecting too early).
  // You can replace `null` with a spinner component if you want.
  if (loading) return null;

  // === AUTH CHECK ===
  // If no user is logged in -> redirect to /login.
  // `replace` tells React Router to **replace** the current history entry instead of pushing a new one.
  // Why this matters: after redirecting, pressing Back won’t bounce the user back to the blocked page.
  // We also pass `state={{ from: loc }}` so the login screen knows where to send the user afterwards.
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  // === ROLE CHECK (optional) ===
  // If `allow` is provided, we enforce role-based access.
  // We accept either a string ("coach") or an array (["coach", "client"]).
  // We also normalize casing and your earlier naming ("sub-clients" -> "client").
  if (allow) {
    const allowed = (Array.isArray(allow) ? allow : [allow])
      .map(v => String(v).toLowerCase());

    const rawRole = String(user?.role ?? "").toLowerCase();
    const role = rawRole === "sub-clients" ? "client" : rawRole;

    // If the user’s role is not in the allowed list -> redirect to a universal “not allowed” landing.
    // We use /profile so both coaches and clients have a safe place to land.
    if (!allowed.includes(role)) {
      return <Navigate to="/profile" replace />;
    }
  }

  // === RENDER ===
  // Support **both** usage patterns:
  // 1) Wrapper pattern:
  //    <Route path="/coach/profile" element={
  //      <ProtectedRoute allow="coach"><Profile/></ProtectedRoute>
  //    }/>
  //
  // 2) Parent/Outlet pattern (recommended for groups):
  //    <Route element={<ProtectedRoute allow="client" />}>
  //      <Route path="/search" element={<SearchPage/>}/>
  //    </Route>
  //
  // `children ?? <Outlet />` means:
  // - if children were provided directly, render them
  // - otherwise render whatever matched child route into <Outlet />
  return children ?? <Outlet />;
}
