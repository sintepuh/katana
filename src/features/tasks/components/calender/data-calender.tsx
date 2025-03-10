import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { Calendar, dateFnsLocalizer, NavigateAction } from "react-big-calendar";

import { Task } from "@/features/tasks/types";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./main.css";
import EventCard from "./event-card";
import CalenderToolbar from "./calender-toolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type DataCalenderProps = {
  data: Task[];
};

const DataCalender = ({ data }: DataCalenderProps) => {
  const [value, setValue] = useState(new Date());

  const events = data.map((task) => ({
    title: task.name,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    project: task.project,
    assignee: task.assignee,
    id: task.$id,
    status: task.status,
  }));

  const handlerNavigation = (action: NavigateAction) => {
    if (action === "PREV") setValue(subMonths(value, 1));
    else if (action === "NEXT") setValue(addMonths(value, 1));
    else if (action === "TODAY") setValue(new Date());
  };

  console.log({ events });

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (data, culture, localizer) =>
          localizer?.format(data, "EEEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            assignee={event.assignee}
            project={event.project}
            title={event.title}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CalenderToolbar date={value} onNavigate={handlerNavigation} />
        ),
      }}
    />
  );
};

export default DataCalender;
