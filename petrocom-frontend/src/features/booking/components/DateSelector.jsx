// src/features/booking/components/DateSelector.jsx

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DateSelector = ({ value, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-PE', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(newDate);
    setShowCalendar(false);
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Añadir días vacíos al principio
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Añadir días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isDateAvailable = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= minDate;
  };

  const isSelected = (day) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 border-2 border-[#D7DCE1] rounded-xl focus-within:border-[#238A55] focus-within:bg-[#F4F5F6] transition-all cursor-pointer"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#238A55]" />
          <span className="text-[#07073b] font-medium">
            {value ? formatDate(value) : 'Selecciona una fecha'}
          </span>
        </div>
        <ChevronRight className={`w-5 h-5 text-[#5F6B76] transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
      </div>

      {showCalendar && (
        <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-[#F4F5F6] rounded-xl shadow-2xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth('prev')}
              className="p-2 hover:bg-[#F4F5F6] rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#5F6B76]" />
            </button>
            <h3 className="text-lg font-bold text-[#07073b]">
              {currentMonth.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => changeMonth('next')}
              className="p-2 hover:bg-[#F4F5F6] rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#5F6B76]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
              <div key={index} className="text-xs font-semibold text-[#5F6B76] py-2">
                {day}
              </div>
            ))}
            
            {renderCalendar().map((day, index) => (
              <button
                key={index}
                onClick={() => day && handleDateSelect(day)}
                disabled={!day || !isDateAvailable(day)}
                className={`p-2 rounded-lg transition-all ${
                  !day 
                    ? 'text-[#5F6B76] cursor-not-allowed' 
                    : isDateAvailable(day)
                      ? 'hover:bg-[#F4F5F6] cursor-pointer'
                      : 'cursor-not-allowed opacity-50'
                } ${
                  isSelected(day)
                    ? 'bg-[#238A55] text-white'
                    : 'bg-[#F4F5F6] border border-[#D7DCE1]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowCalendar(false)}
              className="px-4 py-2 bg-[#F4F5F6] hover:bg-[#5F6B76] text-[#05052f] rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
