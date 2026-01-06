import { Modal, Button, Form } from "react-bootstrap";

// EventModal
// What this component does:
// -> A pop-up modal for creating/editing an appointment (event).
// -> Shows a small form (title, start time, end time) + action buttons (save/cancel/delete).
//
// Where it's used:
// -> Opened from the Schedule page / calendar when user creates or clicks an existing event.
// -> Used as the UI layer only (logic stays in the parent page/component).
//
// Props:
// show (boolean)
// -> Controls if the modal should be visible.
//
// mode ("create" | "edit")
// -> Decides title text + whether to show the "Delete" button.
//
// form (object)
// -> Holds current input values (title, startLocal, endLocal).
//
// onChange (function(field, value))
// -> Updates the parent form state when user types.
//
// onClose (function)
// -> Closes the modal (used by X button, backdrop click, and Cancel button).
//
// onSave (function)
// -> Saves the current form (create/update event).
//
// onDelete (function)
// -> Deletes the current event (only used in edit mode).
//
// Notes:
// -> We use React-Bootstrap's Modal for consistent Bootstrap styling + built-in modal behavior.
// -> "if (!show) return null" avoids rendering the modal at all when closed (no hidden DOM).
export default function EventModal({ show, mode, form, onChange, onClose, onSave, onDelete }) {
  // If modal is closed -> render nothing
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
