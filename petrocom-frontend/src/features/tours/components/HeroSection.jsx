// src/features/tours/components/HeroSection.jsx

import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Fuel,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { usePublicMotion } from '../../../shared/motion/publicMotionContext';
import heroImage from '../../../assets/images/logo/logo.png';

const modeOptions = [
  { value: 'services', label: 'Servicios' },
  { value: 'projects', label: 'Proyectos' },
  { value: 'about', label: 'Empresa' },
];

const HeroSection = () => {
  const [mode, setMode] = useState('services');
  const [projectQuery, setProjectQuery] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollTo } = usePublicMotion();

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(heroRef.current.querySelectorAll('[data-home-title-line]'), { yPercent: 110 }, {
        yPercent: 0, duration: 1.15, stagger: 0.12, ease: 'power3.out', delay: 0.12,
      });
      gsap.fromTo(heroRef.current.querySelector('img'), { scale: 1.08 }, {
        scale: 1, duration: 1.8, ease: 'power2.out',
      });
    }, heroRef);
    return () => media.revert();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = mode === 'services' ? serviceQuery : projectQuery;
    const params = new URLSearchParams();
    if (query) params.append('search', query);

    navigate({
      pathname: mode === 'services' ? '/services' : '/projects',
      search: params.toString() ? `?${params.toString()}` : '',
      hash: mode === 'services' ? '#servicios-listado' : '#projects-results',
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
  const inputPlaceholder =
    mode === 'services'
      ? 'ITF, Registro de Hidrocarburos, GLP...'
      : 'Estacion de servicio, consumidor directo...';
  const suggestions = mode === 'services' ? serviceSuggestions : projectSuggestions;
  const value = mode === 'services' ? serviceQuery : projectQuery;
  const onChange = mode === 'services' ? setServiceQuery : setProjectQuery;

  return (
    <>
    <section ref={heroRef} className="home-hero relative overflow-hidden bg-[#07073b] text-white" data-motion-hero aria-labelledby="home-hero-title">
      <div className="home-hero-media absolute inset-0">
        <img
          src={heroImage}
          alt="Estacion de servicio, tanques GLP e ingenieria de hidrocarburos"
          className="h-full w-full object-cover object-[center_56%] opacity-90"
          data-motion-parallax="4"
        />
        <div className="home-hero-overlay absolute inset-0" />
        <div className="home-hero-blend absolute inset-x-0 bottom-0" />
      </div>

      <div className="container-custom home-hero-content relative z-10">
        <div className="home-hero-copy">
          <div className="home-hero-eyebrow" data-motion-item>
            <span aria-hidden="true" /> PETROCOM ENERGY <b>/</b> INGENIERÍA Y GESTIÓN
          </div>

          <h1 id="home-hero-title" className="home-display-title" aria-label="Ingeniería que impulsa tu proyecto.">
            <span><span data-home-title-line>INGENIERÍA</span></span>
            <span><span data-home-title-line>QUE IMPULSA</span></span>
            <span><span data-home-title-line className="home-title-mint">TU PROYECTO.</span></span>
          </h1>

          <p className="home-hero-description" data-motion-item>
            Desarrollamos expedientes, ingenieria y acompañamiento tecnico para instalaciones de
            combustibles liquidos, GLP y operaciones reguladas por OSINERGMIN.
          </p>

          <div className="home-hero-actions" data-motion-item>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="home-primary-action"
            >
              Explorar servicios
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/consulta-tramite')}
              className="home-secondary-action"
            >
              Consultar tramite
              <ClipboardCheck className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
      <div className="container-custom home-hero-footer" data-motion-item>
        <span><MapPin size={14} aria-hidden="true" /> HUANCAYO, PERÚ</span>
        <a href="#home-buscador" onClick={(event) => { event.preventDefault(); scrollTo('#home-buscador'); }}><span>ENCUENTRA TU PRÓXIMO PASO</span><ArrowDown size={18} aria-hidden="true" /></a>
        <span className="home-footer-specialty">INGENIERÍA / ENERGÍA / GESTIÓN</span>
      </div>
    </section>

    <section id="home-buscador" className="home-quick-access">
      <div className="container-custom home-quick-grid">
        <div className="home-quick-intro" data-motion-section>
          <p>EXPLORA PETROCOM</p>
          <h2>Una ruta clara<br /><span>para tu proyecto.</span></h2>
          <div className="home-quick-specialties">
            {[
              { icon: Fuel, text: 'Infraestructura de hidrocarburos', count: 'ITF' },
              { icon: ShieldCheck, text: 'Cumplimiento y seguridad', count: 'OSINERGMIN' },
              { icon: Users, text: 'Atencion para empresas y titulares', count: '24h' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="home-hero-stat rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[#C58A2A]" />
                    <span className="text-lg font-black text-white">{item.count}</span>
                  </div>
                  <p className="text-sm leading-5 text-white/74">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="home-search-panel rounded-lg border border-white/20 bg-[#F4F5F6] p-4 text-[#07073b] shadow-2xl shadow-black/30 sm:p-5"
          data-motion-section
        >
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#E5E9E7] p-1">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`rounded-md px-2 py-2 text-xs font-black transition sm:text-sm ${
                  mode === option.value
                    ? 'bg-white text-[#07073b] shadow-sm'
                    : 'text-[#5F6B76] hover:bg-white/60'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {isAbout ? (
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#238A55]">
                  Equipo especializado
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-[#07073b]">
                  Una ruta tecnica desde la evaluacion hasta la aprobacion.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5F6B76]">
                  Coordinamos ingenieria, documentacion y seguimiento para mantener cada
                  expediente claro, trazable y alineado con la normativa aplicable.
                </p>
              </div>

              <div className="grid gap-2">
                {['Evaluacion regulatoria', 'Expediente tecnico', 'Levantamiento de observaciones'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#303840]">
                      <CheckCircle2 className="h-4 w-4 text-[#238A55]" />
                      {item}
                    </div>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate('/contacto')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#07073b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#10104d]"
              >
                Hablar con un especialista
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-[#07073b]">{inputLabel}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#238A55]" />
                  <input
                    type="text"
                    placeholder={inputPlaceholder}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-14 w-full rounded-lg border border-[#D7DCE1] bg-white pl-12 pr-4 text-sm font-semibold text-[#07073b] outline-none transition placeholder:text-[#7B8792] focus:border-[#238A55] focus:ring-4 focus:ring-[#A8D8BA]/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#238A55] px-6 text-sm font-black text-white shadow-lg shadow-[#238A55]/20 transition hover:-translate-y-0.5 hover:bg-[#196B43]"
              >
                <Search className="h-5 w-5" />
                {mode === 'services' ? 'Buscar servicios' : 'Buscar proyectos'}
              </button>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7B8792]">
                  Prueba con
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onChange(item)}
                      className="rounded-full border border-[#D7DCE1] bg-white px-3 py-1.5 text-xs font-bold text-[#5F6B76] transition hover:border-[#238A55]/40 hover:text-[#196B43]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default HeroSection;
