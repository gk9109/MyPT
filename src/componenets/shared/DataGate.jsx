import { RotateLoader } from "react-spinners";

// What this component does:
// -> Acts as a generic data-loading gate for UI components.
// -> Displays a loading spinner while data is being fetched or not yet available.
// -> Renders its children only when data is ready.
//
// Where it's used:
// -> Wraps components that depend on async data (Firestore fetches, API calls).
// -> Used to avoid repeating loading/empty checks in every component.
//
// Props:
// data (any)
// -> The data the wrapped UI depends on.
// -> If null, the component is considered "not ready".
//
// loading (boolean, optional)
// -> Explicit loading flag.
// -> If true, the spinner is shown regardless of data value.
//
// children (ReactNode)
// -> UI to render once data is ready.
//
// Notes:
// -> This component does NOT fetch data.
// -> It only controls when children are rendered based on readiness.
// -> Commonly used alongside useEffect + async fetch logic.
export default function DataGate({ data, loading, children }) {
  // If data is still loading or explicitly marked as loading,
  // block rendering and show a centered spinner
  if (loading || data === null) {
    return (
      // show centered loader while waiting for data
      <div className="d-flex justify-content-center align-items-center py-5">
        <RotateLoader color="#0d6efd" size={15} margin={2} />
      </div>
    );
  }
  // Once data is ready, render whatever UI was passed as children
  return children;
}
