// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Fuel,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import MotionTitle from '../../../shared/motion/MotionTitle';
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
    <section className="relative overflow-hidden bg-[#07073b] text-white" data-motion-hero>
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Estacion de servicio, tanques GLP e ingenieria de hidrocarburos"
          className="h-full w-full object-cover object-[center_56%] opacity-90"
          data-motion-parallax="5"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,59,0.94)_0%,rgba(7,7,59,0.78)_47%,rgba(7,7,59,0.30)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4F5F6] to-transparent" />
      </div>

      <div className="container-custom relative z-10 grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:py-16 xl:py-20">
        <div className="max-w-3xl" data-motion-item>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-[#C58A2A]" />
            Ingenieria, seguridad y gestion regulatoria
          </div>

          <MotionTitle
            as="h1"
            className="max-w-4xl text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-6xl"
          >
            PETROCOM Energy
          </MotionTitle>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            Desarrollamos expedientes, ingenieria y acompanamiento tecnico para instalaciones de
            combustibles liquidos, GLP y operaciones reguladas por OSINERGMIN.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#238A55] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#196B43]"
            >
              Explorar servicios
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/consulta-tramite')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Consultar tramite
              <ClipboardCheck className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Fuel, text: 'Infraestructura de hidrocarburos', count: 'ITF' },
              { icon: ShieldCheck, text: 'Cumplimiento y seguridad', count: 'OSINERGMIN' },
              { icon: Users, text: 'Atencion para empresas y titulares', count: '24h' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur"
                  data-motion-item
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
          className="rounded-lg border border-white/20 bg-[#F4F5F6] p-4 text-[#07073b] shadow-2xl shadow-black/30 sm:p-5"
          data-motion-item
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
  );
};

export default HeroSection;
