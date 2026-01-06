import { ClipLoader  } from "react-spinners";

// Loader (ClipLoader)
// What this component does:
// -> Displays a full-screen circular loading spinner.
// -> Alternative loader style to the default RotateLoader.
//
// Where it's used:
// -> Can be used in places where a simpler or different spinner style is preferred.
// -> Useful for page loads, button actions, or lightweight async states.
//
// Notes:
// -> Uses ClipLoader from react-spinners.
// -> Structurally identical to Loader.jsx, only the spinner type differs.
// -> Having separate components allows easy swapping without changing logic elsewhere.
export default function LoaClipLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <ClipLoader  color="#0d6efd" size={15} margin={2} />
    </div>
  );
}
