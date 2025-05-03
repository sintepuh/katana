"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

const NotFoundPage = () => {
  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="max-w-md w-full text-center">
        <ClipboardList className="mx-auto h-24 w-24 text-primary mb-8" />
        <h1 className="text-4xl font-bold mb-2">
          404: Задача не найдена
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Похоже, эта задача выпала из списка дел!
        </p>
        <div className="bg-accent rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 text-left">
            <Checkbox id="task1" checked={true} />
            <label
              htmlFor="task1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Создать потрясающий проект
            </label>
          </div>
          <div className="flex items-center space-x-2 text-left mt-2">
            <Checkbox id="task2" checked={true} />
            <label
              htmlFor="task2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Создать потрясающие функции
            </label>
          </div>
          <div className="flex items-center space-x-2 text-left mt-2">
            <Checkbox id="task3" checked={false} />
            <label
              htmlFor="task3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 line-through text-muted-foreground"
            >
              Не забудыть создать эту страницу
            </label>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href="/">Вернуться к проектам</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
