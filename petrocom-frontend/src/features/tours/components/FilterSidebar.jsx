// src/features/tours/components/FilterSidebar.jsx
import { Star, X, Filter } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear, isMobile = false, onClose }) => {
  const handleApply = () => {
    onApply();
    if (isMobile && onClose) onClose();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 space-y-3 relative border border-[#D7DCE1] text-[#07073b] text-sm">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#07073b] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#238A55]" />
            Filtros
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F4F5F6] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#5F6B76]" />
          </button>
        </div>
      )}

      {!isMobile && (
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#07073b] flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#238A55]" />
          Filtros
        </h3>
      )}

      <div className="space-y-1.5 bg-[#ffffff] border border-[#D7DCE1] rounded-xl p-2 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#07073b]">
          <Star className="w-4 h-4 text-[#238A55]" />
          Solo destacados
        </div>
        <label className="flex items-center gap-2 text-sm text-[#07073b]">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked ? 1 : '')}
            className="h-4 w-4 rounded border-[#D7DCE1] text-[#238A55] focus:ring-[#238A55] focus:outline-none"
            style={{ accentColor: '#238A55' }}
          />
          Mostrar proyectos destacados
        </label>
      </div>

      <div className="flex gap-3 pt-2 border-t border-[#D7DCE1]">
        <button
          onClick={onClear}
          className="flex-1 px-3 py-1.5 border-2 border-[#D7DCE1] text-[#07073b] font-semibold rounded-xl hover:bg-[#F4F5F6] transition-all text-sm"
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-1.5 bg-[#238A55] text-white font-semibold rounded-xl hover:bg-[#196B43] transition-all shadow-md text-sm"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
