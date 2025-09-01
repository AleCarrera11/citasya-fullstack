import React, { useState } from 'react';
import { VscCheck } from 'react-icons/vsc';

interface AvailabilitySelectorProps {
  onChange?: (availability: {
    days: Record<string, boolean>;
    startTime: string;
    endTime: string;
  }) => void;
}

const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  onChange,
}) => {
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const toggleDay = (day: string) => {
    const newDays = {
      ...selectedDays,
      [day]: !selectedDays[day],
    };
    setSelectedDays(newDays);
    if (onChange) {
      onChange({
        days: newDays,
        startTime,
        endTime,
      });
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    if (onChange) {
      onChange({
        days: selectedDays,
        startTime: e.target.value,
        endTime,
      });
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    if (onChange) {
      onChange({
        days: selectedDays,
        startTime,
        endTime: e.target.value,
      });
    }
  };

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'];

  return (
    <div className="w-full px-8 mt-4">
      <div className="bg-[#D6EBF3]/30 rounded-lg p-4">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day) => (
            <div key={day} className="flex flex-col items-center">
              <div className="text-sm text-gray-600 mb-1">{day}</div>
              <button
                type="button"
                className={`h-10 w-full flex items-center justify-center rounded ${selectedDays[day] ? 'bg-[#B9D8E1] text-[#447F98]' : 'bg-gray-100 text-gray-400'}`}
                onClick={() => toggleDay(day)}
              >
                {selectedDays[day] && (
                    <VscCheck />
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Hora Inicio:
            </label>
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="w-full px-3 py-2 border border-[#447F98] focus:border-[#447F98] focus:ring-[#447F98] ring-1 ring-[#447F98] rounded-md text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Hora Fin:
            </label>
            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              className="w-full px-3 py-2 border border-[#447F98] focus:border-[#447F98] focus:ring-[#447F98] ring-1 ring-[#447F98] rounded-md text-sm bg-white"
            />
          </div>
        </div>
    </div>
    </div>
  );
};

export default AvailabilitySelector;