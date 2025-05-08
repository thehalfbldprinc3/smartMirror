'use client';

import { useState, useEffect } from 'react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const totalDays = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-400" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`p-2 text-center rounded-md transition-all duration-300 ${
            isToday ? 'bg-yellow-500 text-black font-bold shadow-md' : 'hover:bg-gray-700'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-primary p-4 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-semibold mb-2">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-gray-400 font-medium">
            {day}
          </div>
        ))}
        {generateCalendar()}
      </div>
    </div>
  );
};

export default CalendarWidget;
