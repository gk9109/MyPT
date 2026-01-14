export default function CoachAvatar({ src, size = 56 }) {
  const fallback = "https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.600.jpg"; // replace later 

  return (
    <img
      src={src || fallback}
      alt="Coach"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover"
      }}
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
}
