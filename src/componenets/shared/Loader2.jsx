import { ClipLoader  } from "react-spinners";

export default function LoaClipLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <ClipLoader  color="#0d6efd" size={15} margin={2} />
    </div>
  );
}
