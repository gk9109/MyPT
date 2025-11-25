import { RotateLoader } from "react-spinners";

export default function DataGate({ data, loading, children }) {
  if (loading || data === null) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <RotateLoader color="#0d6efd" size={15} margin={2} />
      </div>
    );
  }

  return children;
}
