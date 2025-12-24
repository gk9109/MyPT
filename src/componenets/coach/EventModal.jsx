import { Modal, Button, Form } from "react-bootstrap";

export default function EventModal({ show, mode, form, onChange, onClose, onSave, onDelete }) {
  // Mode -> create/edit
  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "create" ? "New Appointment" : "Edit Appointment"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Session with a client"
            autoFocus
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start</Form.Label>
          <Form.Control
            type="datetime-local"
            value={form.startLocal}
            onChange={(e) => onChange("startLocal", e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-2">
          <Form.Label>End</Form.Label>
          <Form.Control
            type="datetime-local"
            value={form.endLocal}
            onChange={(e) => onChange("endLocal", e.target.value)}
          />
        </Form.Group>

      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        {mode === "edit" ? (
          <Button variant="outline-danger" onClick={onDelete}>
            Delete
          </Button>
        ) : (
          <div />
        )}

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={onSave}>
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
