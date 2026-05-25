// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, Users } from 'lucide-react';
import heroImage from '../../../assets/images/logo/logo.png';


const HeroSection = () => {
  const [mode, setMode] = useState('services');
  const [projectQuery, setProjectQuery] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'services') {
      const params = new URLSearchParams();
      if (serviceQuery) params.append('search', serviceQuery);
      navigate({
        pathname: '/services',
        search: params.toString() ? `?${params.toString()}` : '',
        hash: '#servicios-listado',
      });
      return;
    }

    const params = new URLSearchParams();
    if (projectQuery) {
      params.append('search', projectQuery);
    }
    navigate({
      pathname: '/projects',
      search: params.toString() ? `?${params.toString()}` : '',
      hash: '#projects-results',
    });
  };

  const projectSuggestions = [
    'Edificio Multifamiliar Ecológica Plaza',
    'Casa de Campo Zurite',
    'Vivienda unifamiliar',
    'Remodelación integral',
    'Oficina comercial',
  ];
  const serviceSuggestions = [
    'Diseño, Construcción y Regularización Inmobiliaria',
    'Servicios Inmobiliarios',
    'Trámites y Regularización Inmobiliaria',
    'Diseño de interiores',
    'Topografía',
  ];

  const isAbout = mode === 'about';
  const inputLabel = mode === 'services' ? 'Servicio o palabra clave' : 'Ciudad o destino';
  const inputPlaceholder = mode === 'services'
    ? 'Licencias, diseño, topografia...'
    : 'Ciudad, tipo de proyecto o referencia';
  const suggestions = mode === 'services' ? serviceSuggestions : projectSuggestions;
  const value = mode === 'services' ? serviceQuery : projectQuery;
  const onChange = mode === 'services' ? setServiceQuery : setProjectQuery;

  return (
    <section className="relative min-h-[760px] lg:min-h-[820px] flex items-center justify-center overflow-hidden px-3 sm:px-6 py-10">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
        <img
          src={heroImage}
          alt="Hero background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      <div className="container-custom relative z-20 text-center">
        <div className="animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight transition-transform duration-500 hover:-translate-y-1">
              Diseñamos espacios que hablan por ti.
            </h1>
            <p className="text-base sm:text-lg lg:text-2xl text-white font-semibold tracking-wide transition-colors duration-500 hover:text-white">
              Arquitectura y gestion de proyectos para viviendas, oficinas y espacios comerciales.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4">
            {['services', 'projects', 'about'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  mode === value
                    ? 'bg-white text-[#07073b] border-white shadow-lg'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:-translate-y-0.5'
                }`}
              >
                {value === 'projects' && 'Proyectos'}
                {value === 'services' && 'Servicios'}
                {value === 'about' && 'Empresa'}
              </button>
            ))}
          </div>

          {isAbout ? (
            <div className="max-w-5xl mx-auto bg-[#07073b]/80 border border-white/30 rounded-3xl p-8 text-white shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-[#07073b]/85">
              <p className="text-3xl md:text-4xl font-black mb-3">10+ años de experiencia combinada</p>
              <p className="text-white/85 mb-6 text-lg max-w-3xl mx-auto">
                Equipo de arquitectos e ingenieros que lidera licencias, diseño, construccion y supervision.
                Cuentanos tu idea y la llevamos a proyecto ejecutable.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/contacto')}
                  className="px-6 py-3 rounded-full bg-white text-[#07073b] font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                >
                  Hablemos ahora
                </button>
                <a
                  href="#nosotros"
                  className="px-6 py-3 rounded-full border border-white/60 text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Ver fortalezas
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-5xl mx-auto mt-8 bg-[#f3f4f6] rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_55px_rgba(15,27,53,0.20)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_auto] gap-4 items-end">
                <div className="text-left">
                  <label className="block text-sm font-semibold text-[#07073b] mb-2">{inputLabel}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#65647a] w-5 h-5" />
                    <input
                      type="text"
                      placeholder={inputPlaceholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#dfe2ea] focus:border-[#1fb74d] focus:outline-none transition-all text-[#07073b] font-medium hover:border-[#1fb74d]/60"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {mode === 'services' ? 'Buscar servicios' : 'Buscar proyectos'}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#65647a]">
                    Prueba con:
                </span>
                {suggestions.slice(0, 4).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onChange(item)}
                    className="rounded-full border border-[#dfe2ea] bg-white px-3 py-1 text-xs font-semibold text-[#65647a] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1fb74d]/30 hover:text-[#e8a12f]"
                  >
                    {item}
                  </button>
                ))}
              </div>

              
            </form>  
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[{ icon: Star, text: 'Clientes que confian en Casaliz', count: '98%' }, { icon: Star, text: 'Proyectos disenados y construidos', count: '120+' }, { icon: Users, text: 'Años de experiencia combinada', count: '10+' }].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[#f3f4f6]/10 backdrop-blur-sm rounded-lg p-4 text-white animate-fade-in transition-all duration-500 hover:-translate-y-1 hover:bg-[#f3f4f6]/15"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-[#1fb74d] fill-current" />
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
