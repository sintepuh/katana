"use client";

import { ClassValue } from "clsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";


type DatePickerProps = {
  value?: Date;
  onChange: (date: Date) => void;
  className?: ClassValue;
  placeholder?: string;
};

const DatePicker = ({
  onChange,
  className,
  placeholder = "Выберите дату",
  value,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-card w-full justify-start text-left font-normal px-3",
            !value && "",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4" />{" "}
          {value ? format(value, "PPP", { locale: ru }) : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="" align="start">
        <Calendar mode="single" locale={ru} selected={value}  onSelect={(date) => onChange(date as Date)} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
