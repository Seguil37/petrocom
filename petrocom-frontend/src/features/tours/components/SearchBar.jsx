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
      <div className="bg-white rounded-2xl shadow-lg p-2 md:p-2.5 border border-[#dfe2ea] text-[#07073b]">
        <div className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2 text-[#07073b]">
          <Home className="w-4 h-4 text-[#1fb74d]" />
          Encuentra tu proyecto
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65647a] w-5 h-5" />
            <input
              type="text"
              placeholder="Busca por ciudad o proyecto"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCityFilter('');
              }}
              className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 border-[#dfe2ea] text-[#07073b] placeholder-[#65647a] focus:outline-none focus:border-[#1fb74d] transition-all bg-white"
            />
          </div>

          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65647a] w-5 h-5" />
            <input
              type="text"
              placeholder="Tipo de proyecto"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 border-[#dfe2ea] text-[#07073b] placeholder-[#65647a] focus:outline-none focus:border-[#1fb74d] transition-all bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1fb74d] text-white font-bold py-2.5 rounded-xl hover:bg-[#168a3d] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar proyectos
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[#07073b]">
          <Sparkles className="w-4 h-4 text-[#1fb74d]" />
          <span className="text-xs text-[#65647a]">Ciudades frecuentes:</span>
          {['Lima', 'Arequipa', 'Cusco', 'Trujillo'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setLocation(tag)}
              className="text-xs px-3 py-1 bg-white border border-[#dfe2ea] hover:bg-[#ffffff] text-[#e8a12f] rounded-full transition-colors"
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
