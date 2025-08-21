import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container text-center py-5">
      <h1 className="mb-4">Welcome to MyPT</h1>
      <p className="lead mb-5">
        A platform for personal trainers and trainees — create, track, and achieve your fitness goals!
      </p>

      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">I’m a Trainer</h3>
              <p className="card-text">
                Sign up to offer workout & dietary plans, track your clients’ progress, and grow your business.
              </p>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">I’m a Client</h3>
              <p className="card-text">
                Sign up to find a trainer, get personalized workout & dietary plans, and track your progress.
              </p>
              <Link to="/register" className="btn btn-success">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p>Already have an account?</p>
        <Link to="/login" className="btn btn-outline-secondary">
          Login
        </Link>
      </div>
    </div>
  );
}
