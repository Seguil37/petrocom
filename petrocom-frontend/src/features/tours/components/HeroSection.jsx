// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, Search, Star, Users } from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1727483892297-56448c8f1af1?auto=format&fit=crop&w=1800&q=80';

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
    if (projectQuery) params.append('search', projectQuery);
    navigate({
      pathname: '/projects',
      search: params.toString() ? `?${params.toString()}` : '',
      hash: '#projects-results',
    });
  };

  const projectSuggestions = [
    'Estaciones de servicio',
    'Gasocentros de GLP',
    'Consumidores directos',
    'Transporte de combustibles',
  ];
  const serviceSuggestions = [
    'Informe Tecnico Favorable - ITF',
    'Registro de Hidrocarburos',
    'Planes de contingencia',
    'Levantamiento de observaciones',
  ];

  const isAbout = mode === 'about';
  const inputLabel = mode === 'services' ? 'Servicio o tramite' : 'Tipo de proyecto';
  const inputPlaceholder = mode === 'services'
    ? 'ITF, Registro de Hidrocarburos, GLP...'
    : 'Estacion de servicio, consumidor directo...';
  const suggestions = mode === 'services' ? serviceSuggestions : projectSuggestions;
  const value = mode === 'services' ? serviceQuery : projectQuery;
  const onChange = mode === 'services' ? setServiceQuery : setProjectQuery;

  return (
    <section className="relative min-h-[760px] lg:min-h-[820px] flex items-center justify-center overflow-hidden px-3 sm:px-6 py-10">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#05052f]/90 via-[#07073b]/75 to-[#303840]/80 z-10" />
        <img
          src={heroImage}
          alt="Estacion de servicio y surtidores de combustible"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      <div className="container-custom relative z-20 text-center">
        <div className="animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight transition-transform duration-500 hover:-translate-y-1">
              Especialistas en proyectos y tramites para el sector hidrocarburos
            </h1>
            <p className="mx-auto max-w-5xl text-base sm:text-lg lg:text-2xl text-white/90 font-semibold tracking-wide transition-colors duration-500 hover:text-white">
              Brindamos asesoria tecnica, elaboracion de expedientes y acompanamiento integral para combustibles liquidos, GLP, estaciones de servicio, consumidores directos y transporte de hidrocarburos.
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
            <div className="max-w-5xl mx-auto bg-[#07073b]/82 border border-white/30 rounded-3xl p-8 text-white shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-[#07073b]/88">
              <p className="text-3xl md:text-4xl font-black mb-3">Gestion tecnica, normativa y documental</p>
              <p className="text-white/85 mb-6 text-lg max-w-3xl mx-auto">
                Acompanamos a empresas y titulares desde la evaluacion inicial hasta la presentacion, seguimiento y levantamiento de observaciones del expediente.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/contacto')}
                  className="px-6 py-3 rounded-full bg-white text-[#07073b] font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                >
                  Contactanos
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/consulta-tramite')}
                  className="px-6 py-3 rounded-full border border-white/60 text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Consultar tramite
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-5xl mx-auto mt-8 bg-[#F4F5F6] rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_55px_rgba(15,27,53,0.20)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_auto] gap-4 items-end">
                <div className="text-left">
                  <label className="block text-sm font-semibold text-[#07073b] mb-2">{inputLabel}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B76] w-5 h-5" />
                    <input
                      type="text"
                      placeholder={inputPlaceholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#D7DCE1] focus:border-[#238A55] focus:outline-none transition-all text-[#07073b] font-medium hover:border-[#238A55]/60"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#238A55] hover:bg-[#196B43] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {mode === 'services' ? 'Buscar servicios' : 'Buscar proyectos'}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5F6B76]">
                  Prueba con:
                </span>
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onChange(item)}
                    className="rounded-full border border-[#D7DCE1] bg-white px-3 py-1 text-xs font-semibold text-[#5F6B76] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#238A55]/30 hover:text-[#C58A2A]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </form>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: ClipboardList, text: 'Expedientes tecnicos y documentales', count: 'ITF' },
              { icon: Star, text: 'Seguimiento y levantamiento de observaciones', count: 'Gestion' },
              { icon: Users, text: 'Atencion para empresas y titulares', count: 'GLP' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F4F5F6]/10 backdrop-blur-sm rounded-lg p-4 text-white animate-fade-in transition-all duration-500 hover:-translate-y-1 hover:bg-[#F4F5F6]/15"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-[#238A55]" />
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="rounded-xl bg-white px-5 py-3 font-bold text-[#07073b] shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Ver servicios
            </button>
            <button
              type="button"
              onClick={() => navigate('/consulta-tramite')}
              className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
            >
              Consultar tramite
            </button>
            <a
              href="https://wa.me/51927985691?text=Hola%20PETROCOM%20Energy%2C%20necesito%20asesoria%20para%20un%20tramite%20de%20hidrocarburos."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#238A55] px-5 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#196B43]"
            >
              Contactanos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
