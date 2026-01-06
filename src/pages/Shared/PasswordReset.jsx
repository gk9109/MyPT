import { useState } from "react";
import { auth } from "../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

// PasswordReset
// What this component does:
// -> Allows users to request a password reset email.
// -> Uses Firebase Authentication to send a reset link.
// -> Displays success/error messages during the process.
//
// Where it's used:
// -> Public route (/passwordreset).
// -> Accessed from the Login page.
//
// Notes:
// -> Firebase must have password reset emails enabled:
//    Firebase Console -> Authentication -> Templates -> Password reset
export default function PasswordReset() {
  // Controlled form state
  const [email, setEmail] = useState("");
  // UI feedback state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    // Handle password reset form submission
    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        // Basic validation: email must be provided
        if (!email.trim()) {
          setError("Please enter your email.");
          return;
        }
      
        setLoading(true);
      
        try {
          // sendPasswordResetEmail(auth, email)
          // -> Firebase Auth function that sends a reset link to the email.
          // -> Returns: Promise<void>
          await sendPasswordResetEmail(auth, email);
          // Generic success message (does not reveal if email exists)
          setMessage("If this email is registered, a reset link has been sent.");
        } catch (err) {
          setError("Failed to send reset email.");
        }
      
        setLoading(false);
    };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-3">Reset Password</h3>

      <form onSubmit={handleReset}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Feedback messages */}
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center mt-3">
          <Link to="/login" className="text-muted">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
