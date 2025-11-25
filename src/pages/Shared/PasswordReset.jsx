import { useState } from "react";
import { auth } from "../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    // handles the submision of email for password reset
    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        // checking the user entered an email
        if (!email.trim()) {
          setError("Please enter your email.");
          return;
        }
      
        setLoading(true);
      
        try {
            // using firebaes func to sened a password reset email,
            // gotta make sure its allowed throgh firebase console
            // firebase -> authentication -> templates -> password reset
          await sendPasswordResetEmail(auth, email);
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
