import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface CalendarViewProps {
  today: Date | null;
  onSelectDate: (date: Date | undefined) => void;
}

export function CalendarView({ today, onSelectDate }: CalendarViewProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-8 pb-20 max-w-7xl mx-auto">
        <div className="bg-card border rounded-2xl p-4 sm:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 shadow-sm">
          <div className="flex-1 overflow-x-auto">
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" /> Full Calendar
            </h3>
            <div className="flex justify-center">
              <Calendar 
                mode="single" 
                selected={today || undefined} 
                onSelect={onSelectDate}
                className="border rounded-xl shadow-sm bg-card max-w-full" 
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
