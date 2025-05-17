'use client';

import { useState, useEffect, useRef } from 'react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [showEvents, setShowEvents] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleDayClick = async (day: number) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isoDate = clickedDate.toISOString();

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: isoDate }),
      });

      if (!res.ok) {
        console.error('Failed to fetch events:', res.statusText);
        return;
      }

      const events = await res.json();
      setTasks(events);
      setShowEvents(true);

      hideTimeoutRef.current = setTimeout(() => {
        setShowEvents(false);
        setTimeout(() => setTasks([]), 300);
      }, 5000);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
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
          onClick={() => handleDayClick(day)}
          className={`cursor-pointer p-2 text-center rounded-md transition-all duration-300 ${
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
    <div className="bg-primary p-4 rounded-lg shadow-md text-white flex gap-6">
      <div>
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

      {/* Events panel to the right */}
      <div
        className={`w-80 mt-0 transition-opacity duration-300 ${
          showEvents ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-live="polite"
      >
        {tasks.length > 0 && (
          <>
            <h3 className="text-md font-semibold mb-2">Events on Selected Day:</h3>
            <ul className="list-disc list-inside text-sm max-h-[400px] overflow-y-auto">
              {tasks.map((event, index) => (
                <li key={index} className="mb-2">
                  <div className="font-semibold">{event.summary || 'Untitled Event'}</div>
                  <div className="text-gray-300 text-xs">
                    {event.start?.dateTime
                      ? new Date(event.start.dateTime).toLocaleString()
                      : event.start?.date}
                    {' → '}
                    {event.end?.dateTime
                      ? new Date(event.end.dateTime).toLocaleString()
                      : event.end?.date}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;