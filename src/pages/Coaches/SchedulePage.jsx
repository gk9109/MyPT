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

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function SchedulePage () {
  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    startLocal: "",
    endLocal: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAppointments(){
      const data = await getAppointments(user.uid);
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

  const toLocalInput = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };


  const handleSelectSlot = ({ start, end }) => {
    openCreateModal({ start, end });
  };

  const handleSelectEvent = (event) => {
    openEditModal(event);
  };

  const handleModalSave = async () => {
    const title = eventForm.title.trim();
    if (!title) return;
    if (!eventForm.startLocal || !eventForm.endLocal) return;

    try {
      const start = new Date(eventForm.startLocal);
      const end = new Date(eventForm.endLocal);

      if (modalMode === "create") {
        // Save to Firestore
        const newDocId = await addAppointment(user.uid, { title, start, end });

        // Update UI state
        setEvents((prev) => [
          ...prev, 
          { docId: newDocId, title, start, end },
        ]);
      } else {
        // Update Firestore
        await updateAppointment(user.uid, selectedEvent.docId, { title, start, end });

        // Update UI state
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

  const handleModalDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteAppointment(user.uid, selectedEvent.docId);
      setEvents((prev) => prev.filter((e) => e.docId !== selectedEvent.docId));
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };


  // pretty display for the modal (no need to be perfect)
  const formatDT = (d) => d ? d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";

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

  const closeModal = () => setShowModal(false);

  const updateEventForm = (field, value) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4">
      <h2>Coach Schedule</h2>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={date}
        step={15}
        timeslots={4}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        style={{ height: 500, margin: "40px 0", backgroundColor: "white", borderRadius: "10px", padding: "10px" }}
      />
      <EventModal
        show={showModal}
        mode={modalMode}
        form={eventForm}
        onChange={updateEventForm}
        onClose={closeModal}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      />
    </div>
  );
};


