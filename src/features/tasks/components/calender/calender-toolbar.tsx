import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type CalenderToolbarProps = {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
};
const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const CalenderToolbar = ({ date, onNavigate }: CalenderToolbarProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 mb-4">
      <div className="flex items-center w-full lg:w-auto justify-center lg:justify-start">
        <Button
          onClick={() => onNavigate("PREV")}
          variant="secondary"
          size="icon"
          className="flex items-center"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <div className="flex items-center border border-input rounded-md px-3 py-2 h-10 justify-center w-full lg:w-auto">
          <CalendarIcon className="size-4 mr-2" />
          <p className="text-sm">
            {monthNames[date.getMonth()]} {date.getFullYear()}
          </p>
        </div>
        <Button
          onClick={() => onNavigate("NEXT")}
          variant="secondary"
          size="icon"
        >
          <ChevronRightIcon className="size-4" />
        </Button>

      </div>
      <Button
        onClick={() => onNavigate("TODAY")}
        variant="secondary"
        className=""
      >
        Сегодня
      </Button>
    </div>
  );
};

export default CalenderToolbar;
