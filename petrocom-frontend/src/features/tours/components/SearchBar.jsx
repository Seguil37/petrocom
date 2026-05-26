// src/features/tours/components/SearchBar.jsx
import { useEffect, useState } from 'react';
import { Search, Sparkles, Home } from 'lucide-react';

const SearchBar = ({ filters, onFilterChange, onSearch }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [cityFilter, setCityFilter] = useState(filters.city || '');
  const [typeInput, setTypeInput] = useState(filters.type || '');

  useEffect(() => {
    setSearchInput(filters.search || '');
    setCityFilter(filters.city || '');
    setTypeInput(filters.type || '');
  }, [filters.city, filters.search, filters.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cityValue = cityFilter;
    const nextFilters = {
      ...filters,
      search: searchInput,
      city: cityValue,
      type: typeInput,
    };
    onFilterChange('search', searchInput);
    onFilterChange('city', cityValue);
    onFilterChange('type', typeInput);
    onSearch(nextFilters);
  };

  const setLocation = (city) => {
    setCityFilter(city);
    setSearchInput(city);
    const nextFilters = {
      ...filters,
      search: city,
      city,
      type: typeInput,
    };
    onFilterChange('search', city);
    onFilterChange('city', city);
    onSearch(nextFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-2 md:p-2.5 border border-[#D7DCE1] text-[#07073b]">
        <div className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2 text-[#07073b]">
          <Home className="w-4 h-4 text-[#238A55]" />
          Encuentra tu categoria
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B76] w-5 h-5" />
            <input
              type="text"
              placeholder="Busca por actividad, tramite o ciudad"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCityFilter('');
              }}
              className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 border-[#D7DCE1] text-[#07073b] placeholder-[#5F6B76] focus:outline-none focus:border-[#238A55] transition-all bg-white"
            />
          </div>

          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B76] w-5 h-5" />
            <input
              type="text"
              placeholder="Tipo de expediente"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 border-[#D7DCE1] text-[#07073b] placeholder-[#5F6B76] focus:outline-none focus:border-[#238A55] transition-all bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#238A55] text-white font-bold py-2.5 rounded-xl hover:bg-[#196B43] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar categorias
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[#07073b]">
          <Sparkles className="w-4 h-4 text-[#238A55]" />
          <span className="text-xs text-[#5F6B76]">Busquedas frecuentes:</span>
          {['Huancayo', 'Estaciones de servicio', 'GLP', 'Transporte'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setLocation(tag)}
              className="text-xs px-3 py-1 bg-white border border-[#D7DCE1] hover:bg-[#ffffff] text-[#C58A2A] rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
