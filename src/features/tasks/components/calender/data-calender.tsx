import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Calendar, dateFnsLocalizer, NavigateAction } from "react-big-calendar";

import { Task } from "@/features/tasks/types";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./main.scss";
import EventCard from "./event-card";
import CalenderToolbar from "./calender-toolbar";
import { ru } from "date-fns/locale";

const locales = {
  ru: ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
  defaultLocale: "ru",
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

  return (
    <div className="calendar-container">
      <div className="calendar-toolbar">
        <CalenderToolbar date={value} onNavigate={handlerNavigation} />
      </div>
      <div className="calendar-scrollable">
        <Calendar
          localizer={localizer}
          date={value}
          events={events}
          views={["month"]}
          defaultView="month"
          toolbar
          showAllEvents
          className="h-full min-w-fit"
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
          formats={{
            // Вариант 1: Сокращенное название с большой буквы ("Пн", "Вт")
            weekdayFormat: (date, culture, localizer) => {
              const day = localizer?.format(date, "EEEEEE", culture) ?? "";
              return day.charAt(0).toUpperCase() + day.slice(1);
            },

            // ИЛИ Вариант 2: Полное название дня недели ("Понедельник")
            // weekdayFormat: (date, culture, localizer) => {
            //   const day = localizer?.format(date, "EEEE", culture) ?? "";
            //   return day.charAt(0).toUpperCase() + day.slice(1);
            // },

            monthHeaderFormat: (date, culture, localizer) =>
              localizer?.format(date, "LLLL yyyy", culture) ?? "",
          }}
          messages={{
            today: "Сегодня",
            previous: "Назад",
            next: "Вперед",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            agenda: "Повестка",
            date: "Дата",
            time: "Время",
            event: "Событие",
            noEventsInRange: "Нет событий в этом диапазоне.",
          }}
          dayPropGetter={(date) => {
            const hasEvent = events.some(
              (e) => new Date(e.start).toDateString() === date.toDateString()
            );

            return {
              className: hasEvent ? "has-events" : "",
            };
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
              <></>
            ),
          }}
          culture="ru"
        />
      </div>
    </div>
  );
};

export default DataCalender;