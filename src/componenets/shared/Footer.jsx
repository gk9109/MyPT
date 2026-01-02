import React from 'react'
import '/src/style/globals.css'

// What this component does:
// -> Renders the global footer of the application.
// -> Displays basic contact information, social links, and a short description.
//
// Where it's used:
// -> Included at the bottom of the main layout.
// -> Appears on all public and authenticated pages.
//
// Props:
// None
//
// Notes:
// -> This is a purely presentational component.
// -> It does not contain any logic, state, or external data dependencies.
export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 py-4" >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <span className="fw-bold">Contact Us:</span>
          <div className="small">email@example.com</div>
          <div className="small">+1-234-567-8901</div>
        </div>
        <div>
          <span className="fw-bold">Follow:</span>
          <div className="small">Instagram | Facebook | WhatsApp</div>
        </div>
        <div>
          <span className="fw-bold">About:</span>
          <div className="small">Your project slogan or short description.</div>
        </div>
      </div>
    </footer>
  );

}
