
export default function ProfileGallery({ gallery, selectedFile, onSelectFile, onAdd, onRemoveGalleryImage }) {
  return (
    <div>
      <h5 className="fw-bold mb-3">Gallery</h5>

      <div className="d-flex gap-2 mb-3">
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => onSelectFile(e.target.files?.[0] || null)}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onAdd}
          disabled={!selectedFile}
        >
          Add
        </button>
      </div>

      {gallery.length === 0 ? (
        <p className="text-muted mb-0">No gallery images yet.</p>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {gallery.map((item, idx) => (
            <div key={item.path || item.url || idx} className="border rounded p-2">
              <img
                src={item.url}
                alt={`Gallery ${idx + 1}`}
                style={{ width: 160, height: 110, objectFit: "cover", borderRadius: 8 }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-danger w-100 mt-2"
                onClick={() => onRemoveGalleryImage(idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
