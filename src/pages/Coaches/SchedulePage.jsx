import React, { useState, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventModal from "../../componenets/coach/EventModal";
import { useAuth } from "../../firebase/AuthContext";
import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from "../../Services/appointments";

// locales / localizer (react-big-calendar)
// -> react-big-calendar needs a "localizer" to format/parse dates correctly.
// -> Kept ABOVE the component so they are created once (not recreated on every render).
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  // format(date, formatString, options)
  // -> Converts a Date into text (used for labels in the calendar UI).
  format,
  // parse(text, formatString, baseDate, options)
  // -> Converts text back into a Date (used internally by the calendar when needed).
  parse,
  // startOfWeek(date, options)
  // -> Tells the calendar what day the week starts on (depends on locale).
  startOfWeek,
  // getDay(date)
  // -> Returns 0-6 (Sun-Sat). Used by the calendar for week layout.
  getDay,
  // locales map ("en-US" -> enUS)
  // -> Supplies date-fns locale rules (month/day names, week start rules, etc.)
  locales
});

// SchedulePage
// What this component does:
// -> Coach-facing schedule page using react-big-calendar.
// -> Loads appointments from Firestore and displays them as calendar events.
// -> Allows creating/editing/deleting appointments using a modal.
//
// Where it's used:
// -> Coach routes/pages (sidebar: "Schedule").
//
// Notes:
// -> Firestore logic is abstracted into Services/appointments.js.
// -> EventModal is the UI layer; this page holds the state + Firestore actions.
export default function SchedulePage () {
  // Current calendar view (week / day / month, etc.)
  const [view, setView] = useState("week");
  // Currently displayed date (react-big-calendar uses this for navigation)
  const [date, setDate] = useState(new Date());
  // Calendar event list shown in the UI
  const [events, setEvents] = useState([]);
  // Modal state (open/close + create/edit mode)
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Controlled form state for the modal inputs
  const [eventForm, setEventForm] = useState({
    title: "",
    startLocal: "",
    endLocal: "",
  });
  // Logged-in coach (uid used for appointment ownership in Firestore)
  const { user } = useAuth();

  // Load appointments from Firestore when the coach logs in / uid changes
  useEffect(() => {
    // getAppointments(uid)
    // -> Service function that fetches appointment docs for this user
    // -> Returns: array of appointments (plain JS objects)
    async function fetchAppointments(){
      const data = await getAppointments(user.uid);
      // Convert Firestore timestamps into JS Date objects for react-big-calendar
      setEvents(
        data.map((a) => ({
          ...a,
          start: a.start.toDate(), // Firestore timestemp -> js date object
          end: a.end.toDate(),
        }))
      );
    }
    if (user?.uid){
      fetchAppointments();
    }
  }, [user?.uid]);

  // Converts a JS Date into a string compatible with <input type="datetime-local" />
  const toLocalInput = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  // User selected an empty time slot on the calendar -> open "create" modal
  const handleSelectSlot = ({ start, end }) => {
    openCreateModal({ start, end });
  };

  // User clicked an existing event -> open "edit" modal
  const handleSelectEvent = (event) => {
    openEditModal(event);
  };

  // Save button in the modal (create or edit)
  const handleModalSave = async () => {
    const title = eventForm.title.trim();
    if (!title) return;
    if (!eventForm.startLocal || !eventForm.endLocal) return;

    // Convert datetime-local strings back into JS Date objects
    try {
      const start = new Date(eventForm.startLocal);
      const end = new Date(eventForm.endLocal);

      if (modalMode === "create") {
        // addAppointment(uid, {title, start, end})
        // -> Creates a new appointment doc in Firestore
        // -> Returns: docId (string) of the new Firestore document
        const newDocId = await addAppointment(user.uid, { title, start, end });

        // Update UI immediately (no refresh needed)
        setEvents((prev) => [
          ...prev, 
          { docId: newDocId, title, start, end },
        ]);
      } else {
        // updateAppointment(uid, docId, {title, start, end})
        // -> Updates the existing Firestore doc for this appointment
        await updateAppointment(user.uid, selectedEvent.docId, { title, start, end });

        // Update UI state locally
        setEvents((prev) =>
          prev.map((e) =>
            e.docId === selectedEvent.docId
              ? { ...e, title, start, end }
              : e
          )
        );
      }

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete button in the modal (edit mode only)
  const handleModalDelete = async () => {
    if (!selectedEvent) return;

    try {
      // deleteAppointment(uid, docId)
      // -> Deletes the appointment doc from Firestore
      await deleteAppointment(user.uid, selectedEvent.docId);
      // Remove from UI state
      setEvents((prev) => prev.filter((e) => e.docId !== selectedEvent.docId));
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  // formatDT
  // -> Formats a Date into a readable string using the browser locale settings.
  // -> toLocaleString([], ...) : passing [] means "use default locale" (same as undefined).
  // -> Used for displaying dates/times nicely in the UI (not required by the calendar itself).

  // const formatDT = (d) => d ? d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";

  // Pre-fill modal state for create mode
  const openCreateModal = ({ start, end }) => {
    setModalMode("create");
    setSelectedEvent(null);
    setEventForm({
      title: "",
      startLocal: toLocalInput(start),
      endLocal: toLocalInput(end),
    });
    setShowModal(true);
  };

  // Pre-fill modal state for edit mode using existing event data
  const openEditModal = (event) => {
    setModalMode("edit");
    setSelectedEvent(event);
    setEventForm({
      title: event.title || "",
      startLocal: toLocalInput(event.start),
      endLocal: toLocalInput(event.end),
    });
    setShowModal(true);
  };

  // Close modal UI (keeps state; modal is controlled by "show")
  const closeModal = () => setShowModal(false);

  // Updates one field in the modal form state
  const updateEventForm = (field, value) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4">
      <h2>Coach Schedule</h2>
      {/* react-big-calendar */}
      <Calendar
        localizer={localizer} // localizer -> controls date formatting/parsing + week rules (required)
        events={events} // events -> array of events, each must include { title, start: Date, end: Date }
        selectable // selectable -> allows selecting empty time slots (to create appointments)
        onSelectSlot={handleSelectSlot} // onSelectSlot -> called when user drags/clicks empty slot
        onSelectEvent={handleSelectEvent} // onSelectEvent -> called when user clicks an existing event
        startAccessor="start" // startAccessor/endAccessor -> tells calendar which fields represent start/end
        endAccessor="end" // 
        view={view} // view/date -> controlled calendar view + current displayed date
        date={date} // 
        step={15} // step/timeslots -> controls time grid (15 min step, 4 slots = 1 hour block)
        timeslots={4} // 
        onView={(newView) => setView(newView)} // onView/onNavigate -> update state when user changes view or navigates
        onNavigate={(newDate) => setDate(newDate)} //
        style={{ height: 500, margin: "40px 0", backgroundColor: "white", borderRadius: "10px", padding: "10px" }}
      />
      {/* EventModal:
        -> UI for creating/editing appointments
        -> All state and actions are controlled by this page */}
      <EventModal
        show={showModal} //  show  -> controls visibility
        mode={modalMode} // mode  -> "create" or "edit" (controls title + delete button)
        form={eventForm} // form  -> controlled input values { title, startLocal, endLocal }
        onChange={updateEventForm} // onChange -> updates one field in form state
        onClose={closeModal} // onClose  -> closes the modal
        onSave={handleModalSave} // onSave   -> creates/updates appointment (Firestore)
        onDelete={handleModalDelete} // onDelete -> deletes appointment (Firestore)
      />
    </div>
  );
};


