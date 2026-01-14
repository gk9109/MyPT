import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import dumbbellAnim from "../../assets/Dumbbell Sumo Squat.json"; // Animation file

// Home
// What this component does:
// -> Landing / home page for unauthenticated users.
// -> Presents a short explanation of the project.
// -> Provides navigation to Register and Login pages.
// -> Displays a looping workout animation for visual appeal.
//
// Where it's used:
// -> Root route ("/").
// -> First page users see before logging in.
//
// Notes:
// -> Layout is split into two halves using Bootstrap flex utilities.
// -> Designed to fit one screen height (no scrolling).
// -> Animation is purely visual 
export default function Home() {
  return (
    <div id="LoginPage" className="d-flex flex-column flex-md-row overflow-hidden border border-black card shadow"
      style={{ height: "70vh" }}>
      {/* Left side:
        -> Project title, description, and auth navigation buttons */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-fill p-4 text-center bg-warning-subtle">
        <h1 className="mb-3">
          Welcome to <span className="text-primary">MyPT</span>
        </h1>
        <p className="mb-4">
          A platform for personal trainers and trainees - create, track,
          and achieve your fitness goals.
        </p>

        <div className="d-flex flex-column gap-3 w-75" style={{ maxWidth: 300 }}>
          {/* Navigation to registration */}
          <Link to="/register" className="btn btn-primary w-100">
            Register
          </Link>
          {/* Navigation to login */}
          <Link to="/login" className="btn btn-outline-secondary w-100">
            Login
          </Link>
        </div>
      </div>

      {/* Right side:
        -> Decorative animation (no interaction / no state) */}
      <div className="d-flex align-items-center justify-content-center flex-fill overflow-hidden bg-warning-subtle">
        <div id="animation" className="w-75" style={{ maxWidth: 350 }}>
          {/* Lottie animation (loops infinitely) */}
          <Lottie animationData={dumbbellAnim} loop />
        </div>
      </div>
    </div>
  );
}
