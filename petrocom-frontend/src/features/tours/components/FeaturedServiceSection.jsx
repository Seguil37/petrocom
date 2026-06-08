import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase } from 'lucide-react';
import { extractArray, servicesApi, toPublicUrl } from '../../../shared/utils/api';

const FeaturedServiceSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFeaturedService = (service) => {
    const value = service?.is_featured ?? service?.featured;
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return Boolean(value);
  };

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await servicesApi.list({ per_page: 8, is_featured: true });
        const data = extractArray(response.data, ['services']);
        const featured = data.filter(isFeaturedService).slice(0, 8);
        setServices(featured);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#F4F5F6]">
        <div className="container-custom text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#238A55] border-t-transparent" />
          <p className="mt-4 text-[#5F6B76]">Cargando servicios...</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section className="py-20 bg-[#F4F5F6]">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 transition-transform duration-500 hover:translate-x-1">
            <Sparkles className="w-8 h-8 text-[#238A55] transition-transform duration-500 hover:scale-110 hover:rotate-6" />
            <h2 className="text-4xl lg:text-5xl font-black text-[#07073b]">Servicios destacados</h2>
          </div>
          <Link
            to="/services"
            className="hidden md:flex items-center gap-2 text-[#238A55] hover:text-[#C58A2A] font-semibold transition-all duration-300 hover:translate-x-1"
          >
            Ver todos los servicios
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const coverImage = toPublicUrl(service.cover_image || service.gallery?.[0]?.path);
            const content = (
              <article className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-[#D7DCE1] h-full">
                <div className="p-4 pb-0">
                  {isFeaturedService(service) && (
                    <span className="inline-flex bg-[#238A55] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transition-transform duration-300 group-hover:scale-105">
                      Destacado
                    </span>
                  )}
                </div>

                <div className="relative overflow-hidden bg-white aspect-[4/3]">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#f8f5ef] px-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#5F6B76]">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/58 px-5 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                    <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0">
                      <h3 className="text-xl font-black text-white drop-shadow-lg">{service.title}</h3>
                      <p className="mt-3 text-sm font-bold text-white">Haz clic para ver el detalle</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
                    <Briefcase className="w-4 h-4 text-[#238A55] transition-transform duration-300 group-hover:rotate-6" />
                    <span>{service.category || 'Servicio'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#07073b] leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-[#238A55]">{service.title}</h3>
                  <p className="text-sm text-[#303840] line-clamp-2">
                    {service.short_description || 'Conoce mas sobre este servicio especializado.'}
                  </p>
                </div>
              </article>
            );

            return (
              <Link key={service.id} to={`/services/${service.slug || service.id}`} className="block h-full">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServiceSection;
