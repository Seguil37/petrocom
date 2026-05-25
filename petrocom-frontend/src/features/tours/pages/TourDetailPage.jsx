// src/features/tours/pages/TourDetailPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Home, ArrowLeft, Heart, X, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import api, { toPublicUrl } from '../../../shared/utils/api';
import ReviewsSection from '../components/ReviewsSection';
import useFavoriteStore from '../../../store/favoriteStore';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';
const TourDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteError, setFavoriteError] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const gallerySectionRef = useRef(null);
  const { favorites, toggleFavorite, fetchFavorites } = useFavoriteStore();
  const { isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch {
        setError('Proyecto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);
  useEffect(() => {
    if (isAuthenticated && user?.role === ROLES.CLIENT) {
      fetchFavorites();
    }
  }, [fetchFavorites, isAuthenticated, user?.role]);
  if (loading) {
    return <div className="container-custom py-16 text-center">Cargando proyecto...</div>;
  }
  if (error || !project) {
    return (
      <div className="container-custom py-16 text-center space-y-4">
        <p className="text-xl text-[#07073b] font-semibold">{error || 'Proyecto no encontrado'}</p>
        <Link to="/projects" className="text-[#238A55] font-semibold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </Link>
      </div>
    );
  }
  const hero = toPublicUrl(project.hero_image || project.images?.[0]?.path);
  const isFavorite = favorites.includes(Number(id));
  const handleToggleFavorite = async () => {
    setFavoriteError('');
    try {
      await toggleFavorite(Number(id));
    } catch (err) {
      setFavoriteError(
        err.message === 'AUTH_REQUIRED'
          ? 'Inicia sesion como cliente para guardar favoritos.'
          : 'No se pudo actualizar tu lista de favoritos.'
      );
    }
  };
  const openImage = (image, index) => {
    setLightboxImage(image);
    setCurrentImageIndex(index);
  };
  const closeImage = () => setLightboxImage(null);
  const showPrevImage = () => {
    if (!project?.images?.length) return;
    const newIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
    setCurrentImageIndex(newIndex);
    setLightboxImage(project.images[newIndex]);
  };
  const showNextImage = () => {
    if (!project?.images?.length) return;
    const newIndex = (currentImageIndex + 1) % project.images.length;
    setCurrentImageIndex(newIndex);
    setLightboxImage(project.images[newIndex]);
  };
  const scrollToGallery = () => {
    gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="bg-gradient-to-b from-[#F4F5F6] via-white to-[#F4F5F6] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07073b] via-[#07073b] to-[#07073b]">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -left-32 top-0 w-80 h-80 rounded-full bg-[#238A55]/20 blur-3xl" />
          <div className="absolute right-[-6rem] bottom-[-4rem] w-96 h-96 rounded-full bg-[#C58A2A]/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container-custom py-16 relative z-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver a proyectos
          </Link>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* CONTENIDO HERO */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#238A55]/20 to-[#C58A2A]/20 backdrop-blur border border-[#238A55]/40 text-[#C58A2A] text-xs uppercase tracking-widest font-bold">
                  ✨ Proyecto Destacado
                </span>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#07073b]/80 to-[#07073b]/80 border border-white/20 text-white text-xs font-semibold shadow-sm">
                  {project.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
                {project.type && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-xs font-semibold">
                    {project.type}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-lg text-white">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3 text-base font-medium text-[#C58A2A]">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {project.city}
                    {project.state ? `, ${project.state}` : ''}
                  </span>
                </div>
              </div>
              {project.summary && (
                <p className="max-w-2xl text-lg text-white/85 leading-relaxed font-light">{project.summary}</p>
              )}
              {isAuthenticated && user?.role === ROLES.CLIENT && (
                <button
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-base border-2 transition-all duration-300 transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-white text-[#07073b] border-white shadow-lg shadow-white/30'
                      : 'bg-transparent text-white border-white hover:bg-white hover:text-[#07073b] hover:shadow-lg hover:shadow-white/20'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-[#07073b]' : ''}`} />
                  {isFavorite ? 'En favoritos' : 'Guardar favorito'}
                </button>
              )}
            </div>
            {/* IMAGEN HERO */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-[#238A55] rounded-3xl blur-2xl opacity-30" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
                  <img
                    src={hero}
                    alt={project.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-[#238A55] text-white text-sm font-bold shadow-lg">
                    {project.images?.length || 0} fotos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* STATS SECTION */}
      <section className="container-custom -mt-8 mb-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Ubicación</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">
              {project.city}
              {project.state ? `, ${project.state}` : ''}
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Tipo de Proyecto</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">{project.type || 'Residencial'}</p>
          </div>
          <button
            type="button"
            onClick={scrollToGallery}
            className="bg-white rounded-2xl border-2 border-[#D7DCE1] shadow-lg p-6 text-left hover:-translate-y-1 hover:shadow-xl transition"
          >
            <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Galería</p>
            <p className="text-lg font-bold text-[#07073b] mt-2">{project.images?.length || 0} imagen(es)</p>
          </button>
        </div>
      </section>
      {/* MAIN CONTENT */}
      <section className="container-custom pb-16 space-y-12">
        {/* DESCRIPCION */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#D7DCE1]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-1 rounded-full bg-[#238A55]" />
              <h2 className="text-2xl font-black text-[#07073b]">Descripción del Proyecto</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#238A55]/30 to-transparent" />
            </div>
            <p className="text-[#303840] leading-relaxed whitespace-pre-line text-base lg:text-lg font-light">
              {project.description || 'Proximamente mas detalles del proyecto.'}
            </p>
          </div>
        </div>
        {/* GALERÍA DE IMÁGENES MEJORADA */}
        {project.images?.length > 0 && (
          <div ref={gallerySectionRef} className="space-y-8 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-widest text-[#238A55] font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Galería
                  </p>
                  <h3 className="text-3xl font-black text-[#07073b]">Recorrido Visual</h3>
                </div>
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#238A55]/10 to-[#C58A2A]/10 border-2 border-[#238A55]/20">
                  <span className="text-sm font-bold text-[#238A55]">{project.images.length} imagen(es)</span>
                </div>
              </div>
              {/* GRID DE IMÁGENES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => openImage(image, index)}
                    className="group relative w-full h-64 overflow-hidden border-2 border-[#D7DCE1] bg-[#F4F5F6] focus:outline-none focus:ring-4 focus:ring-[#238A55]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <img
                      src={toPublicUrl(image.path)}
                      alt={image.caption || project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-4 right-4 text-sm font-bold text-white px-4 py-2 rounded-full bg-[#07073b]/85 border border-white/25 shadow-lg shadow-black/40 backdrop-blur-sm flex items-center gap-2 transition-transform duration-300">
                      Ver grande <ChevronRight className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

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
                to="/projects#projects-results"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-[#07073b] transition-all duration-300"
              >
                Ver Otros Proyectos
              </Link>
            </div>
          </div>
        </section>

      <section className="container-custom pb-16">
        {/* LAYOUT CON SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* SIDEBAR INFO */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#D7DCE1] sticky top-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b-2 border-[#D7DCE1]">
                  <Home className="w-6 h-6 text-[#238A55] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Tipo</p>
                    <p className="text-lg font-bold text-[#07073b] mt-1">{project.type || 'Residencial'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b-2 border-[#D7DCE1]">
                  <div className="w-6 h-6 rounded-full bg-[#238A55] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold">Estado</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-lg font-bold text-[#07073b]">
                        {project.status === 'published' ? 'Publicado' : 'Borrador'}
                      </p>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#F3EFE6] to-[#F3EFE6] border-2 border-[#238A55]/30 text-xs font-bold text-[#7A5A22]">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-xs uppercase tracking-widest text-[#5F6B76] font-bold mb-2">Resumen</p>
                  <p className="text-[#303840] leading-relaxed text-sm font-light">{project.summary || 'Proyecto destacado del portafolio de CASALIZ.'}</p>
                </div>
              </div>
              {isAuthenticated && user?.role === ROLES.CLIENT && (
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full mt-4 flex items-center justify-center gap-3 px-6 py-3 rounded-full font-bold border-2 transition-all duration-300 transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-[#07073b] text-white border-[#07073b] shadow-lg shadow-[#07073b]/30'
                      : 'bg-white text-[#07073b] border-[#07073b] hover:bg-[#07073b] hover:text-white hover:shadow-lg hover:shadow-[#07073b]/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                </button>
              )}
              {favoriteError && <p className="text-sm text-red-600 text-center font-semibold mt-3">{favoriteError}</p>}
            </div>
          </div>
          {/* REVIEWS SECTION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#D7DCE1]">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-1 rounded-full bg-[#238A55]" />
                <h2 className="text-2xl font-black text-[#07073b]">Reseñas de Clientes</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#238A55]/30 to-transparent" />
              </div>
              <ReviewsSection projectId={project.id} />
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MEJORADO */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center px-4 py-8"
          onClick={closeImage}
          role="button"
          tabIndex={0}
          aria-label="Cerrar imagen ampliada"
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeImage}
              className="absolute -top-8 right-0 text-white hover:text-[#C58A2A] transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="overflow-hidden bg-[#07073b] border-2 border-[#238A55]/40 shadow-2xl">
              <div className="relative bg-black">
                <img
                  src={toPublicUrl(lightboxImage.path)}
                  alt={lightboxImage.caption || project.title}
                  className="w-full max-h-[75vh] object-contain"
                />
                {/* CONTROLES NAVEGACIÓN */}
                <button
                  type="button"
                  onClick={showPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#238A55]/80 hover:bg-[#238A55] text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#238A55]/80 hover:bg-[#238A55] text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
                {/* INDICADOR DE PROGRESO */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white text-sm font-semibold">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              </div>
              {lightboxImage.caption && (
                <p className="text-base text-white/90 px-6 py-4 border-t-2 border-[#238A55]/30 font-light bg-gradient-to-r from-black to-black/80">
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
export default TourDetailPage;
