import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesApi, toPublicUrl } from '../../../shared/utils/api';
import { ChevronRight, Zap, CheckCircle, ChevronLeft } from 'lucide-react';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesApi.show(slug);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F4F5F6] to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#238A55] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5F6B76] font-medium">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F4F5F6] to-white">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-[#07073b]">Servicio no encontrado</p>
          <p className="text-[#5F6B76]">Lo sentimos, no pudimos encontrar el servicio que buscas.</p>
        </div>
      </div>
    );
  }

  const coverImage =
    toPublicUrl(service.cover_image || service.gallery?.[0]?.path) ||
    'https://via.placeholder.com/800x500';

  return (
    <div className="bg-gradient-to-b from-[#F4F5F6] via-white to-[#F4F5F6] min-h-screen pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07073b] via-[#07073b] to-[#07073b] text-white">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -left-32 top-0 w-80 h-80 rounded-full bg-[#238A55]/20 blur-3xl" />
          <div className="absolute right-[-6rem] bottom-[-4rem] w-96 h-96 rounded-full bg-[#C58A2A]/20 blur-3xl" />
        </div>

        <div className="container-custom py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* CONTENIDO */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#238A55]/20 border border-[#238A55]/40 backdrop-blur">
                  <Zap className="w-4 h-4 text-[#C58A2A]" />
                  <p className="text-sm uppercase tracking-widest text-[#C58A2A] font-bold">{service.category}</p>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight drop-shadow-lg">
                  {service.title}
                </h1>
              </div>

              <p className="text-lg text-white/85 leading-relaxed max-w-xl font-light">
                {service.short_description}
              </p>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 space-y-4">
                <div className="prose prose-invert max-w-none text-white/90 font-light leading-relaxed text-base whitespace-pre-line">
                  {service.description}
                </div>
              </div>

              <div className="flex pt-4">
                <a
                  href="https://tinyurl.com/CasalizArquitectura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#238A55] text-white font-bold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-[#238A55]/40 transition-all duration-300 transform hover:scale-105"
                >
                  Cotizar Servicio
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* IMAGEN HERO */}
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <img
                  src={coverImage}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMACION DESTACADA */}
      <section className="container-custom -mt-8 mb-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <CheckCircle className="w-8 h-8 text-[#238A55] mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Profesional</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">Equipo Experto</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <Zap className="w-8 h-8 text-[#238A55] mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">RApido</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">Entrega Agil</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <CheckCircle className="w-8 h-8 text-[#238A55] mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Calidad</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">Garantizado</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <Zap className="w-8 h-8 text-[#238A55] mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Soporte</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">24/7 Disponible</p>
          </div>
        </div>
      </section>

      {/* GALERIA MEJORADA */}
      {service.gallery?.length > 0 && (
        <section className="container-custom mb-16">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-[#238A55]" />
                <h2 className="text-3xl font-black text-[#07073b]">Galeria de Trabajos</h2>
              </div>
              <p className="text-[#5F6B76] text-lg font-light">Explora nuestros proyectos y trabajos realizados</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.gallery.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setLightboxImage(image);
                    setCurrentImageIndex(index);
                  }}
                  className="group relative w-full overflow-hidden rounded-2xl border-2 border-[#D7DCE1] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-[#238A55]/50"
                >
                  <img
                    src={toPublicUrl(image.path)}
                    alt={image.caption || service.title}
                    className="w-full aspect-[4/3] object-contain bg-[#F4F5F6] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {image.caption && (
                    <p className="absolute bottom-0 left-0 right-0 text-white font-bold px-6 py-4 text-lg drop-shadow-lg">
                      {image.caption}
                    </p>
                  )}

                  <span className="absolute top-4 right-4 text-white text-xs font-bold px-4 py-2 rounded-full bg-[#238A55]/90 transform opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Ver ampliado +
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LLAMADA A ACCION FINAL */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#07073b] to-[#07073b]">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute right-[-4rem] top-[-2rem] w-96 h-96 rounded-full bg-[#238A55]/20 blur-3xl" />
        </div>

        <div className="container-custom py-16 relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
              Listo para comenzar?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto font-light">
              Contactanos hoy y solicita una cotizacion personalizada para tu proyecto
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-[#238A55] text-white font-bold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-[#238A55]/40 transition-all duration-300 transform hover:scale-105"
            >
              Contactar Ahora
              <ChevronRight className="w-5 h-5" />
            </a>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-[#07073b] transition-all duration-300"
            >
              Ver Otros Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center px-4"
          onClick={() => setLightboxImage(null)}
          role="button"
          tabIndex={0}
          aria-label="Cerrar imagen"
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#C58A2A] transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="rounded-3xl overflow-hidden bg-black border-2 border-[#238A55]/40 shadow-2xl">
              <div className="relative bg-black">
                <img
                  src={toPublicUrl(lightboxImage.path)}
                  alt={lightboxImage.caption || 'Galeria'}
                  className="w-full max-h-[75vh] object-contain"
                />

                {service.gallery?.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const total = service.gallery.length;
                        const prevIndex = (currentImageIndex - 1 + total) % total;
                        setCurrentImageIndex(prevIndex);
                        setLightboxImage(service.gallery[prevIndex]);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#238A55]/80 hover:bg-[#238A55] text-white transition-all duration-300 hover:scale-110 shadow-lg"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const total = service.gallery.length;
                        const nextIndex = (currentImageIndex + 1) % total;
                        setCurrentImageIndex(nextIndex);
                        setLightboxImage(service.gallery[nextIndex]);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#238A55]/80 hover:bg-[#238A55] text-white transition-all duration-300 hover:scale-110 shadow-lg"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="w-7 h-7" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white text-sm font-semibold">
                      {currentImageIndex + 1} / {service.gallery.length}
                    </div>
                  </>
                )}
              </div>

              {lightboxImage.caption && (
                <p className="text-white px-6 py-4 border-t-2 border-[#238A55]/30 font-light bg-black/60">
                  {lightboxImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
