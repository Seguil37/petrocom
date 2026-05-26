// src/features/tours/pages/ToursPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import api from '../../../shared/utils/api';

const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, currentPage: 1, lastPage: 1 });

  const defaultFilters = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    featured: searchParams.get('featured') || '',
  };
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    fetchProjects();
  }, [searchParams]);

  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      type: searchParams.get('type') || '',
      featured: searchParams.get('featured') || '',
    });
  }, [searchParams]);

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        search: searchParams.get('search') || undefined,
        city: searchParams.get('city') || undefined,
        type: searchParams.get('type') || undefined,
        featured: searchParams.get('featured') || undefined,
        page,
      };

      const response = await api.get('/projects', { params });
      const data = response.data;
      setProjects(data.data || data);
      setPagination({
        total: data.total || (data.data ? data.data.length : data.length),
        currentPage: data.current_page || 1,
        lastPage: data.last_page || 1,
      });
    } catch (error) {
      console.error('Error al cargar proyectos', error);
      setProjects([]);
      setPagination({ total: 0, currentPage: 1, lastPage: 1 });
    } finally {
      setLoading(false);
    }
  };

  const buildParams = (currentFilters) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params;
  };

  const handleFilterChange = (filterName, value) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
  };

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById('projects-results')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const applyFilters = (customFilters = filters) => {
    setFilters(customFilters);
    const params = buildParams(customFilters);
    setSearchParams(params);
    scrollToResults();
  };

  const clearFilters = () => {
    const resetFilters = { search: '', city: '', type: '', featured: '' };
    setFilters(resetFilters);
    setSearchParams({});
  };

  const showAllProjects = () => {
    const resetFilters = { search: '', city: '', type: '', featured: '' };
    setFilters(resetFilters);
    setSearchParams({});
    scrollToResults();
  };

  const handlePageChange = (page) => {
    fetchProjects(page);
    scrollToResults();
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#07073b_0%,#10104d_42%,#238A55_84%,#303840_100%)] text-white py-16">
        <div className="absolute inset-0 opacity-16" aria-hidden>
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#C58A2A] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#238A55]/42 blur-3xl" />
          <div className="absolute right-1/3 top-10 h-80 w-80 rounded-full bg-[#7CC99C]/18 blur-3xl" />
        </div>

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EFE6] transition-transform duration-500 hover:translate-x-1">
              <Sparkles className="h-4 w-4 transition-transform duration-500 hover:scale-110 hover:rotate-12" />
              Proyectos PETROCOM
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight transition-transform duration-500 hover:translate-x-1">
              Categorias de proyectos para actividades de hidrocarburos.
            </h1>
            <p className="text-lg max-w-2xl text-white/88 transition-colors duration-500 hover:text-white">
              Explora tipos de expedientes, regularizaciones y gestiones tecnicas para estaciones de servicio, grifos,
              gasocentros, consumidores directos, transporte y almacenamiento de combustibles.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects-results" className="rounded-xl bg-white px-5 py-3 font-bold text-[#07073b] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
                Ver categorias
              </a>
              <button type="button" onClick={showAllProjects} className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/18">
                Mostrar todos
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(35,138,85,0.10))] p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F3EFE6]">Resumen</p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Resultados encontrados', value: loading ? '...' : `${pagination.total}` },
                { label: 'Pagina actual', value: `${pagination.currentPage}` },
                { label: 'Filtros activos', value: `${Object.values(filters).filter(Boolean).length}` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 transition-all duration-300 hover:bg-white/14">
                  <span className="text-sm text-white/80">{item.label}</span>
                  <span className="text-lg font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85">
              Usa el buscador y los filtros para ubicar categorias por actividad, entidad, ciudad o tipo de expediente.
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-20 z-40 border-b border-[#D7DCE1] bg-[#F4F5F6]/95 shadow-sm backdrop-blur lg:hidden">
        <div className="container-custom py-4">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <SearchBar filters={filters} onFilterChange={handleFilterChange} onSearch={applyFilters} />
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-4 pb-8">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="space-y-4">
              <SearchBar filters={filters} onFilterChange={handleFilterChange} onSearch={applyFilters} />
              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onApply={applyFilters} onClear={clearFilters} />
            </div>
          </aside>

          <div className="min-w-0">
            <div id="projects-results" className="mb-4 rounded-[28px] border border-[#D7DCE1] bg-white p-6 shadow-[0_18px_45px_rgba(77,58,31,0.07)] transition-all duration-500 hover:-translate-y-1 scroll-mt-32">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C58A2A]">Listado de proyectos</p>
                  <h2 className="mt-2 mb-2 flex items-center gap-2 text-3xl font-black text-[#07073b]">
                    {filters.search && <MapPin className="h-6 w-6 text-[#238A55]" />}
                    {filters.search || 'Todas las categorias'}
                  </h2>
                  <p className="text-[#5F6B76]">
                    {loading ? 'Cargando...' : <span><span className="font-semibold">{pagination.total}</span> resultados encontrados</span>}
                  </p>
                </div>

                <button onClick={() => setShowFilters(true)} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 font-semibold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white lg:hidden">
                  Filtros
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#D7DCE1] bg-white p-8 text-center shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#07073b]">No encontramos resultados</h3>
                <p className="mb-4 text-[#5F6B76]">Prueba ajustando los filtros o buscando otra actividad.</p>
                <button onClick={clearFilters} className="rounded-full bg-[#07073b] px-4 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#05052f]">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {projects.map((project) => <TourCard key={project.id} tour={project} />)}
                </div>

                {pagination.lastPage > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button type="button" onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))} disabled={pagination.currentPage === 1} className="rounded-full border border-[#D7DCE1] bg-white px-5 py-2.5 font-semibold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#07073b] disabled:cursor-not-allowed disabled:opacity-45">
                      Anterior
                    </button>
                    {Array.from({ length: pagination.lastPage }, (_, index) => index + 1).map((page) => (
                      <button key={page} type="button" onClick={() => handlePageChange(page)} className={`h-11 w-11 rounded-full border text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${page === pagination.currentPage ? 'border-[#238A55] bg-[#238A55] text-white shadow-md' : 'border-[#D7DCE1] bg-white text-[#07073b] hover:border-[#07073b]'}`}>
                        {page}
                      </button>
                    ))}
                    <button type="button" onClick={() => handlePageChange(Math.min(pagination.lastPage, pagination.currentPage + 1))} disabled={pagination.currentPage === pagination.lastPage} className="rounded-full border border-[#D7DCE1] bg-white px-5 py-2.5 font-semibold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#07073b] disabled:cursor-not-allowed disabled:opacity-45">
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex bg-black/50 lg:hidden">
          <div className="w-80 overflow-y-auto bg-white p-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={(f) => {
                applyFilters(f);
                setShowFilters(false);
              }}
              onClear={() => {
                clearFilters();
                setShowFilters(false);
              }}
              isMobile
              onClose={() => setShowFilters(false)}
            />
          </div>
          <div className="flex-1" onClick={() => setShowFilters(false)} />
        </div>
      )}
    </div>
  );
};

export default ToursPage;
