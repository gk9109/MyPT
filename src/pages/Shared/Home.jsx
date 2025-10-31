import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import dumbbellAnim from "../../assets/Dumbbell Sumo Squat.json"; // Animation file

/*
  COMPONENT PURPOSE:
  ------------------
  - Split the homepage into two halves:
      Left: project info + Register / Login buttons
      Right: looping dumbbell workout animation
  - Fully responsive, Bootstrap-based, and fits one screen (no scroll)
*/

export default function Home() {
  return (
    <div id="LoginPage" className="d-flex flex-column flex-md-row overflow-hidden border border-black card shadow"
       style={{ height: "70vh" }}>
      {/* --- Left side: text + buttons --- */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-fill p-4 text-center bg-secondary-subtle">
        <h1 className="mb-3">
          Welcome to <span className="text-primary">MyPT</span>
        </h1>
        <p className="mb-4">
          A platform for personal trainers and trainees — create, track,
          and achieve your fitness goals.
        </p>

        <div className="d-flex flex-column gap-3 w-75" style={{ maxWidth: 300 }}>
          <Link to="/register" className="btn btn-primary w-100">
            Register
          </Link>
          <Link to="/login" className="btn btn-outline-secondary w-100">
            Login
          </Link>
        </div>
      </div>

      {/* --- Right side: animation --- */}
      <div className="d-flex align-items-center justify-content-center flex-fill overflow-hidden bg-secondary-subtle">
        <div id="animation" className="w-75" style={{ maxWidth: 350 }}>
              {/*  The animation itself */}
          <Lottie animationData={dumbbellAnim} loop />
        </div>
      </div>
    </div>
  );
}
