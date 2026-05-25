// src/features/booking/components/GuestSelector.jsx

import { Users, Plus, Minus } from 'lucide-react';

const GuestSelector = ({ 
  adults, 
  children, 
  infants, 
  minPeople, 
  maxPeople, 
  onAdultsChange, 
  onChildrenChange, 
  onInfantsChange 
}) => {
  const totalGuests = adults + children + infants;

  return (
    <div className="space-y-6">
      {/* Adultos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#238A55]" />
          <span className="font-medium text-[#07073b]">Adultos</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
            disabled={adults <= 1}
            className="w-8 h-8 rounded-full bg-[#F4F5F6] hover:bg-[#F4F5F6] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-[#C58A2A]" />
          </button>
          <span className="w-8 text-center font-semibold text-[#07073b]">{adults}</span>
          <button
            onClick={() => onAdultsChange(adults + 1)}
            disabled={adults >= maxPeople || totalGuests >= maxPeople}
            className="w-8 h-8 rounded-full bg-[#F4F5F6] hover:bg-[#F4F5F6] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C58A2A]" />
          </button>
        </div>
      </div>

      {/* Niños */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#238A55]" />
          <span className="font-medium text-[#07073b]">Niños</span>
          <span className="text-xs text-[#5F6B76]">(2-11 años)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChildrenChange(Math.max(0, children - 1))}
            disabled={children <= 0}
            className="w-8 h-8 rounded-full bg-[#F4F5F6] hover:bg-[#F4F5F6] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-[#C58A2A]" />
          </button>
          <span className="w-8 text-center font-semibold text-[#07073b]">{children}</span>
          <button
            onClick={() => onChildrenChange(children + 1)}
            disabled={totalGuests >= maxPeople}
            className="w-8 h-8 rounded-full bg-[#F4F5F6] hover:bg-[#F4F5F6] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C58A2A]" />
          </button>
        </div>
      </div>

      {/* Infantes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#238A55]" />
          <span className="font-medium text-[#07073b]">Infantes</span>
          <span className="text-xs text-[#5F6B76]">(0-2 años)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onInfantsChange(Math.max(0, infants - 1))}
            disabled={infants <= 0}
            className="w-8 h-8 rounded-full bg-[#F4F5F6] hover:bg-[#F4F5F6] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-[#C58A2A]" />
          </button>
          <span className="w-8 text-center font-semibold text-[#07073b]">{infants}</span>
          <button
            onClick={() => onInfantsChange(infants + 1)}
            disabled={totalGuests >= maxPeople}
            className="w-8 h-8 rounded-full bg-[#F4F5F6] hover:bg-[#F4F5F6] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C58A2A]" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 p-4 bg-[#F4F5F6] rounded-xl">
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#07073b]">Total:</span>
          <span className="font-bold text-[#07073b]">{totalGuests} personas</span>
        </div>
        <p className="text-sm text-[#C58A2A] mt-1">
          Capacidad: {minPeople} - {maxPeople} personas
        </p>
      </div>
    </div>
  );
};

export default GuestSelector;
