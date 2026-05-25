// src/features/tours/components/FilterSidebar.jsx
import { Star, X, Filter } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear, isMobile = false, onClose }) => {
  const handleApply = () => {
    onApply();
    if (isMobile && onClose) onClose();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 space-y-3 relative border border-[#dfe2ea] text-[#07073b] text-sm">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#07073b] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#1fb74d]" />
            Filtros
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f3f4f6] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#65647a]" />
          </button>
        </div>
      )}

      {!isMobile && (
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#07073b] flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#1fb74d]" />
          Filtros
        </h3>
      )}

      <div className="space-y-1.5 bg-[#ffffff] border border-[#dfe2ea] rounded-xl p-2 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#07073b]">
          <Star className="w-4 h-4 text-[#1fb74d]" />
          Solo destacados
        </div>
        <label className="flex items-center gap-2 text-sm text-[#07073b]">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked ? 1 : '')}
            className="h-4 w-4 rounded border-[#dfe2ea] text-[#1fb74d] focus:ring-[#1fb74d] focus:outline-none"
            style={{ accentColor: '#1fb74d' }}
          />
          Mostrar proyectos destacados
        </label>
      </div>

      <div className="flex gap-3 pt-2 border-t border-[#dfe2ea]">
        <button
          onClick={onClear}
          className="flex-1 px-3 py-1.5 border-2 border-[#dfe2ea] text-[#07073b] font-semibold rounded-xl hover:bg-[#f3f4f6] transition-all text-sm"
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-1.5 bg-[#1fb74d] text-white font-semibold rounded-xl hover:bg-[#168a3d] transition-all shadow-md text-sm"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
