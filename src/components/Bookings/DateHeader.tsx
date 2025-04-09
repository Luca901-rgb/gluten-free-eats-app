
import React from 'react';
import { Calendar } from 'lucide-react';

interface DateHeaderProps {
  date: string;
}

const DateHeader = ({ date }: DateHeaderProps) => {
  return (
    <h2 className="text-lg font-medium mb-3 flex items-center">
      <Calendar className="mr-2 h-5 w-5" />
      {new Date(date).toLocaleDateString('it-IT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </h2>
  );
};

export default DateHeader;
