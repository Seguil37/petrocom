import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Sparkles, Briefcase } from 'lucide-react';
import { servicesApi, toPublicUrl } from '../../../shared/utils/api';

const SERVICES_PER_PAGE = 12;

const serviceHighlights = [
  'Informe Tecnico Favorable - ITF',
  'Registro de Hidrocarburos',
  'Grifos y estaciones de servicio',
  'Gasocentros de GLP',
  'Consumidores directos',
  'Locales de venta de GLP',
  'Transporte de combustibles',
  'Almacenamiento y distribucion',
  'Planes de contingencia',
  'Matrices de riesgo',
  'Levantamiento de observaciones',
  'Planos y memorias tecnicas',
  'OSINERGMIN',
];

const normalizeText = (value) =>
  (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const ServicesPage = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || location.state?.prefill || '');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [featuredOnly, setFeaturedOnly] = useState(
    searchParams.get('featured') === '1' || searchParams.get('featured') === 'true'
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.list({ per_page: 100 });
        const data = response.data?.data ?? response.data ?? [];
        setServices(data);
      } catch (error) {
        console.error('Error fetching services', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fromQuery = searchParams.get('search') || '';
    setSearchTerm(fromQuery || location.state?.prefill || '');
    setAppliedSearchTerm(fromQuery);
    setCategoryFilter(searchParams.get('category') || '');
    const featuredFromUrl = searchParams.get('featured');
    setFeaturedOnly(featuredFromUrl === '1' || featuredFromUrl === 'true');
  }, [searchParams, location.state]);

  useEffect(() => {
    if (!loading && location.hash === '#servicios-listado') scrollToResults();
  }, [loading, location.hash]);

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById('servicios-listado')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const applyFiltersToQuery = (nextSearchTerm, nextCategory, nextFeatured) => {
    const params = new URLSearchParams();
    if (nextSearchTerm) params.append('search', nextSearchTerm);
    if (nextCategory) params.append('category', nextCategory);
    if (nextFeatured) params.append('featured', '1');
    setAppliedSearchTerm(nextSearchTerm);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFiltersToQuery(searchTerm, categoryFilter, featuredOnly);
    scrollToResults();
  };

  const handleFeaturedToggle = (checked) => {
    setFeaturedOnly(checked);
    applyFiltersToQuery(searchTerm, categoryFilter, checked);
    scrollToResults();
  };

  const showAllServices = () => {
    setSearchTerm('');
    setAppliedSearchTerm('');
    setCategoryFilter('');
    setFeaturedOnly(false);
    setSearchParams({});
    scrollToResults();
  };

  const isFeaturedService = (service) => {
    const value = service?.is_featured ?? service?.featured;
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return Boolean(value);
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchableText = normalizeText(`${service.title} ${service.short_description || ''} ${service.category || ''}`);
      const normalizedSearch = normalizeText(appliedSearchTerm);
      const normalizedCategory = normalizeText(categoryFilter);
      const matchesText = appliedSearchTerm ? searchableText.includes(normalizedSearch) : true;
      const matchesCategory = categoryFilter ? normalizeText(service.category || '').includes(normalizedCategory) : true;
      const matchesFeatured = featuredOnly ? isFeaturedService(service) : true;
      return matchesText && matchesCategory && matchesFeatured;
    });
  }, [services, appliedSearchTerm, categoryFilter, featuredOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearchTerm, categoryFilter, featuredOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / SERVICES_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);
  }, [filteredServices, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToResults();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F6]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F4F5F6] min-h-screen pb-12">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#07073b_0%,#10104d_42%,#238A55_82%,#303840_100%)] text-white py-16">
        <div className="absolute inset-0 opacity-14 pointer-events-none">
          <div className="absolute -left-16 -top-10 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute right-0 bottom-0 w-[32rem] h-[32rem] rounded-full bg-[#238A55]/45 blur-3xl" />
          <div className="absolute right-1/4 top-8 w-80 h-80 rounded-full bg-[#7CC99C]/18 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 rounded-full text-sm font-semibold uppercase tracking-wide border border-white/25 transition-transform duration-500 hover:translate-x-1">
              <span className="h-2 w-2 rounded-full bg-[#C58A2A] transition-transform duration-500 hover:scale-125" />
              Servicios PETROCOM
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight transition-transform duration-500 hover:translate-x-1">
              Servicios tecnicos y gestion documental para hidrocarburos.
            </h1>
            <p className="text-lg max-w-2xl text-white/90 transition-colors duration-500 hover:text-white">
              Elaboramos expedientes, planos, informes, planes de contingencia y subsanaciones para combustibles liquidos,
              GLP, estaciones de servicio, consumidores directos y transporte de combustibles.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#servicios-listado" className="px-5 py-3 rounded-xl bg-white text-[#07073b] font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
                Ver servicios
              </a>
              <button
                type="button"
                onClick={showAllServices}
                className="px-5 py-3 rounded-xl border border-white/35 bg-white/10 text-white font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
              >
                Mostrar todos
              </button>
            </div>
          </div>

          <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(35,138,85,0.10))] border border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-white/80 mb-4">
              <Briefcase className="w-5 h-5 transition-transform duration-500 hover:scale-110 hover:rotate-6" />
              Encuentra tu servicio
            </div>
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ITF, Registro de Hidrocarburos, GLP..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  placeholder="Categoria o actividad"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => handleFeaturedToggle(e.target.checked)}
                  className="h-4 w-4 rounded border-white/60 bg-white/20 text-[#C58A2A] focus:ring-white/60"
                />
                <Sparkles className="w-4 h-4 text-[#C58A2A]" />
                <span>Ver solo destacados</span>
              </label>
              <button type="submit" className="w-full bg-white text-[#07073b] font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                Buscar servicios
              </button>
              <button type="button" onClick={showAllServices} className="w-full rounded-xl border border-white/25 bg-white/10 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/18">
                Mostrar todos los servicios
              </button>
              <div className="flex flex-wrap gap-2 text-xs text-white/80">
                <Sparkles className="w-4 h-4 text-[#C58A2A]" />
                <span>Sugerencias:</span>
                {['Informe Tecnico Favorable - ITF', 'Registro de Hidrocarburos', 'Transporte de combustibles'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 -mt-8 relative z-10">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#D7DCE1] p-4 space-y-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(35,50,116,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[#5F6B76]">Especialidades</p>
                <h2 className="text-lg font-bold text-[#07073b]">Servicios tecnicos principales</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceHighlights.map((item) => (
                <span key={item} className="px-3 py-1.5 bg-[#ffffff] text-[#07073b] rounded-full shadow-sm border border-[#D7DCE1] text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-[#D7DCE1] p-4 space-y-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(225,95,11,0.10)]">
            <p className="text-xs font-semibold text-[#07073b] uppercase tracking-wide">Gestion integral</p>
            <p className="text-base leading-8 text-[#303840]">
              Te acompanamos desde la evaluacion inicial hasta la presentacion, seguimiento y levantamiento de observaciones del expediente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#07073b]">
              {['ITF', 'OSINERGMIN', 'GLP'].map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-xl bg-[#E9F3EE] border border-[#DDEFE5] font-semibold text-center transition-transform duration-300 hover:-translate-y-0.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <p className="text-[#5F6B76]">No hay servicios publicados con esos filtros.</p>
        ) : (
          <>
            <div id="servicios-listado" className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 scroll-mt-32">
              {paginatedServices.map((service) => {
                const coverImage = toPublicUrl(service.cover_image || service.gallery?.[0]?.path);
                const card = (
                  <article className="group relative rounded-2xl shadow-lg overflow-hidden block h-full bg-gradient-to-br from-[#1b274f] via-[#1f2f63] to-[#0f193a] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(15,25,58,0.26)]">
                    <div className="relative aspect-[4/3] w-full bg-[#f8f5ef] flex items-center justify-center">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={service.title}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="px-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#5F6B76]">
                          Sin imagen
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 text-white">
                        <h3 className="text-2xl font-black drop-shadow-lg md:text-3xl">{service.title}</h3>
                        <p className="mt-3 text-sm font-bold md:text-base">Haz clic para ver el detalle</p>
                      </div>
                    </div>
                  </article>
                );

                return (
                  <Link key={service.id} to={`/services/${service.slug || service.id}`} className="block h-full">
                    {card}
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-full border border-[#D7DCE1] bg-white px-5 py-2.5 font-semibold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#07073b] disabled:cursor-not-allowed disabled:opacity-45">
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-11 w-11 rounded-full border text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${page === currentPage ? 'border-[#238A55] bg-[#238A55] text-white shadow-md' : 'border-[#D7DCE1] bg-white text-[#07073b] hover:border-[#07073b]'}`}
                  >
                    {page}
                  </button>
                ))}
                <button type="button" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="rounded-full border border-[#D7DCE1] bg-white px-5 py-2.5 font-semibold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#07073b] disabled:cursor-not-allowed disabled:opacity-45">
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
