import { RotateLoader } from "react-spinners";

// Loader
// What this component does:
// -> Displays a full-screen loading spinner.
// -> Used while data or app state is still loading.
//
// Where it's used:
// -> Can be rendered by pages, gates, or components during async operations.
// -> Commonly used for auth loading, page-level loading, or data fetch delays.
//
// Notes:
// -> Uses RotateLoader from react-spinners.
// -> Centered both horizontally and vertically using Bootstrap utilities.
// -> height: 100vh ensures the loader fills the entire viewport.
export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <RotateLoader color="#0d6efd" size={15} margin={2} />
    </div>
  );
}
