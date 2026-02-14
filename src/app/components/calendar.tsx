"use client";

import { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type Props = {
  events: any[];
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: any) => void;
};

const Calendar = forwardRef<FullCalendar | null, Props>(
  ({ events, onDateChange, onEventClick }, ref) => {
    return (
      <FullCalendar
        ref={ref}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
        height="auto"
        events={events}
        selectable
        editable
        datesSet={(arg) => onDateChange?.(arg.start)}
        eventClick={(info) => onEventClick?.(info.event)}
      />
    );
  },
);

Calendar.displayName = "Calendar"; // necesario para forwardRef

export default Calendar;
