import { useEffect, useState } from "react";
import { updateEmail } from "firebase/auth";
import { useAuth } from "../../firebase/AuthContext";
import { toast } from "react-toastify";
import { getCoachProfile, saveCoachProfile, uploadProfilePic, uploadGalleryImage, deleteByPath }
from "../../Services/coachProfileService";
import EditProfile from '../../componenets/coach/EditProfile';
import ProfileGallery from '../../componenets/coach/ProfileGallery';
import CoachAvatar from "../../componenets/coach/CoachAvater";

export default function CoachProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedGalleryFile, setSelectedGalleryFile] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    aboutMe: "",

    profilePicUrl: "",
    profilePicPath: "",

    gallery: [] // [{ url, path }]
  });

  // Fetch coach once
  useEffect(() => {
    const run = async () => {
      try {
        const data = await getCoachProfile(user.uid);

        if (data) {
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            aboutMe: data.aboutMe || "",

            profilePicUrl: data.profilePicUrl || "",
            profilePicPath: data.profilePicPath || "",

            gallery: Array.isArray(data.gallery) ? data.gallery : []
          });
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user.uid, user.email]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Upload profile pic -> update state immediately (reactive)
  const handleUploadProfilePic = async (file) => {
    if (!file) return;

    try {
      const { url, path } = await uploadProfilePic(user.uid, file, form.profilePicPath);

      // 1) reactive UI
      setForm((prev) => ({ ...prev, profilePicUrl: url, profilePicPath: path }));

      // 2) persist immediately so it survives refresh
      await saveCoachProfile(user.uid, { profilePicUrl: url, profilePicPath: path });

      toast.success("Profile picture uploaded!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload profile picture");
    }
  };

  // Remove profile pic -> delete from storage + clear Firestore + clear state
  const handleRemoveProfilePic = async () => {
    try {
      // 1) delete from Storage (only if we have a path)
      if (form.profilePicPath) {
        await deleteByPath(form.profilePicPath);
      }

      // 2) reactive UI
      setForm((prev) => ({ ...prev, profilePicUrl: "", profilePicPath: "" }));

      // 3) persist (so refresh returns to avatar)
      await saveCoachProfile(user.uid, { profilePicUrl: "", profilePicPath: "" });

      toast.success("Profile picture removed!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove profile picture");
    }
  };


  // Upload gallery image -> update state immediately (reactive)
  const handleAddGalleryImage = async () => {
    if (!selectedGalleryFile) return;

    try {
      const { url, path } = await uploadGalleryImage(user.uid, selectedGalleryFile);

      // build from the latest state (prev), not from form.gallery
      let updatedGallery = [];

      setForm((prev) => {
        updatedGallery = [...prev.gallery, { url, path }];
        return { ...prev, gallery: updatedGallery };
      });

      // persist to Firestore using the same updated array
      await saveCoachProfile(user.uid, { gallery: updatedGallery });

      // 3) reset picker
      setSelectedGalleryFile(null);

      toast.success("Gallery image added!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add gallery image");
    }
  };


  // Remove gallery image -> delete storage + remove from state
  const handleRemoveGalleryImage = async (idx) => {
    const item = form.gallery[idx];
    if (!item) return;

    try {
      // 1) delete from Storage
      if (item.path) await deleteByPath(item.path);

      // 2) reactive UI
      const updatedGallery = form.gallery.filter((_, i) => i !== idx);
      setForm((prev) => ({ ...prev, gallery: updatedGallery }));

      // 3) persist to Firestore
      await saveCoachProfile(user.uid, { gallery: updatedGallery });

      toast.success("Gallery image removed!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove gallery image");
    }
  };


  const handleSave = async () => {
    try {
      if (form.email !== user.email) {
        await updateEmail(user, form.email);
      }

      await saveCoachProfile(user.uid, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        aboutMe: form.aboutMe,

        // saved for CoachCard later
        profilePicUrl: form.profilePicUrl,
        profilePicPath: form.profilePicPath,

        gallery: form.gallery,

        searchName: `${form.firstName} ${form.lastName}`.toLowerCase()
      });

      toast.success("Profile updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  const coachTitle = form.firstName ? `${form.firstName} ${form.lastName}` : "Coach Profile";

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center gap-3 mb-4">
      <CoachAvatar src={form.profilePicUrl} size={100} />
      <div>
        <h2 className="fw-bold mb-0">{coachTitle}</h2>
      </div>
    </div>

      <div className="card p-4 shadow-sm">
        <EditProfile
          form={form}
          onChange={handleChange}
          onUploadProfilePic={handleUploadProfilePic}
          onRemoveProfilePic={handleRemoveProfilePic}
        />

        <ProfileGallery
          gallery={form.gallery}
          selectedFile={selectedGalleryFile}
          onSelectFile={setSelectedGalleryFile}
          onAdd={handleAddGalleryImage}
          onRemoveGalleryImage={handleRemoveGalleryImage}
        />

        <div className="mt-4">
          <button className="btn btn-primary w-100" onClick={handleSave}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
