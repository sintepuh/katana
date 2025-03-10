"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md w-full text-center">
        <ClipboardList className="mx-auto h-24 w-24 text-purple-400 mb-8" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          404: Task Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Looks like this task fell off our to-do list!
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 text-left">
            <Checkbox id="task1" checked={true} />
            <label
              htmlFor="task1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Create awesome project
            </label>
          </div>
          <div className="flex items-center space-x-2 text-left mt-2">
            <Checkbox id="task2" checked={true} />
            <label
              htmlFor="task2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Build amazing features
            </label>
          </div>
          <div className="flex items-center space-x-2 text-left mt-2">
            <Checkbox id="task3" checked={false} />
            <label
              htmlFor="task3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 line-through text-gray-400"
            >
              Remember to create this page
            </label>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href="/">Back to Our Well-Managed Projects</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
