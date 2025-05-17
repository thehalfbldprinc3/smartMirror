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
            isToday
              ? 'bg-yellow-500/80 text-black font-bold shadow-inner'
              : 'hover:bg-white/10'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <>
      {/* Inject animation CSS */}
      <style jsx>{`
        @keyframes glass-light {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) rotate(45deg);
          }
          100% {
            transform: translateX(-100%) rotate(45deg);
          }
        }

        .animate-glass-light {
          animation: glass-light 6s linear infinite;
        }
      `}</style>

      <div className="relative p-6 rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-white/10 border border-white/20 text-white flex transition-all duration-500 ease-in-out">
        {/* Reflective Light Animation Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <div className="absolute -top-[150%] -left-[150%] w-[400%] h-[400%] bg-gradient-to-tr from-white/20 via-white/10 to-transparent transform rotate-45 blur-md animate-glass-light" />
        </div>

        {/* Glass & Texture Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-60 pointer-events-none mix-blend-overlay z-0" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),_transparent_70%)] mix-blend-overlay z-0" />

        {/* Calendar Section */}
        <div className="relative z-10 flex-shrink-0 w-80">
          <h2 className="text-lg font-semibold mb-2">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-gray-300 font-medium">
                {day}
              </div>
            ))}
            {generateCalendar()}
          </div>
        </div>

        {/* Events Panel */}
        <div
          className={`relative z-10 ml-6 overflow-hidden transition-all duration-500 ease-in-out ${
            showEvents ? 'w-80 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ minHeight: '100%' }}
        >
          <div className="p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/10 shadow-md h-full">
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
      </div>
    </>
  );
};

export default CalendarWidget;