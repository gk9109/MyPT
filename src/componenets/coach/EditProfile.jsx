import React from "react";

export default function EditProfile({ form, onChange, onUploadProfilePic, onRemoveProfilePic  }) {
  return (
    <div>
      <label className="mb-1">First Name</label>
      <input
        name="firstName"
        value={form.firstName}
        onChange={onChange}
        className="form-control mb-3"
      />

      <label className="mb-1">Last Name</label>
      <input
        name="lastName"
        value={form.lastName}
        onChange={onChange}
        className="form-control mb-3"
      />

      <label className="mb-1">Email</label>
      <input
        name="email"
        value={form.email}
        onChange={onChange}
        className="form-control mb-3"
      />

      <label className="mb-1">Phone Number</label>
      <input
        name="phone"
        value={form.phone}
        onChange={onChange}
        className="form-control mb-3"
      />

      <label className="mb-1">Location</label>
      <input
        name="location"
        value={form.location}
        onChange={onChange}
        className="form-control mb-4"
      />

      {/* Profile picture at the top */}
      <div className="mb-4">
        <label className="mb-1">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={(e) => onUploadProfilePic(e.target.files?.[0])}
        />

        <button
          type="button"
          className="btn btn-outline-danger w-100"
          onClick={onRemoveProfilePic}
          disabled={!form.profilePicPath} // only enabled if there is something to delete
        >
          Remove Profile Picture
        </button>
      </div>

      <label className="mb-1">About Me</label>
      <textarea
        name="aboutMe"
        value={form.aboutMe}
        onChange={onChange}
        className="form-control mb-4"
        rows={5}
        placeholder="Tell clients about your coaching style, experience, specialties, etc."
      />

    </div>
  );
}
