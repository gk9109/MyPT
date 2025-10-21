import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SchedulePage = () => {
  const [events, setEvents] = useState([
    {
      title: "Workout Session",
      start: new Date(2025, 9, 16, 10, 0),
      end: new Date(2025, 9, 16, 11, 0),
    },
  ]);

  // When user drags/selects a time range
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title (e.g. Busy, Free, Session):");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  // When user clicks an existing event
  const handleSelectEvent = (event) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      setEvents(events.filter((e) => e !== event));
    }
  };

  return (
    <div className="p-4">
      <h2>Coach Schedule</h2>

      <Calendar
        localizer={localizer}
        events={events}
        selectable={true} // enables drag-to-select
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "40px 0", backgroundColor: "white", borderRadius: "10px", padding: "10px" }}
      />
    </div>
  );
};

export default SchedulePage;
