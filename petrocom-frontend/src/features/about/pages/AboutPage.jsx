// src/features/about/pages/AboutPage.jsx

import { Building2, ClipboardCheck, Eye, Handshake, Layers, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const experienceHighlights = [
  {
    title: 'Experiencia tecnica',
    description: 'Analizamos la actividad, el tipo de establecimiento y los requisitos aplicables antes de estructurar cada expediente.',
    icon: Building2,
  },
  {
    title: 'Gestion normativa',
    description: 'Ordenamos documentacion para ITF, Registro de Hidrocarburos, GLP, consumidores directos y transporte de combustibles.',
    icon: ClipboardCheck,
  },
  {
    title: 'Acompanamiento integral',
    description: 'Damos seguimiento desde la evaluacion inicial hasta la presentacion, observaciones, subsanacion y cierre del tramite.',
    icon: Layers,
  },
];

const capabilityPillars = [
  {
    title: 'Cumplimiento ante entidades competentes',
    detail: 'Preparamos expedientes claros para su revision, seguimiento y levantamiento de observaciones.',
  },
  {
    title: 'Compromiso con la seguridad',
    detail: 'Priorizamos planes de contingencia, matrices de riesgo, procedimientos y medidas de control.',
  },
  {
    title: 'Atencion personalizada',
    detail: 'Definimos rutas de trabajo segun actividad: grifo, estacion, GLP, consumidor directo o transporte.',
  },
];

const companyPrinciples = [
  {
    key: 'mission',
    title: 'Lo que hacemos',
    summary: 'Mision',
    description:
      'Brindar soluciones tecnicas y documentales confiables para proyectos de hidrocarburos, facilitando el cumplimiento normativo y la correcta gestion de tramites.',
    accent: 'from-[#07073b] via-[#10104d] to-[#10104d]',
    ring: 'shadow-[0_24px_60px_rgba(35,50,116,0.18)]',
    icon: Target,
  },
  {
    key: 'vision',
    title: 'Hacia donde vamos',
    summary: 'Vision',
    description:
      'Ser una empresa referente en asesoria y gestion tecnica para actividades de hidrocarburos a nivel regional y nacional.',
    accent: 'from-[#2a5f9d] via-[#3f7ec0] to-[#238A55]',
    ring: 'shadow-[0_24px_60px_rgba(35,138,85,0.18)]',
    icon: Eye,
  },
];

const AboutPage = () => {
  return (
    <div className="bg-[#F4F5F6] text-[#07073b]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#07073b_0%,#10104d_44%,#238A55_84%,#303840_100%)] text-white py-16">
        <div className="absolute inset-0 opacity-14" aria-hidden>
          <div className="absolute -left-12 -top-12 h-72 w-72 rounded-full bg-[#C58A2A] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#238A55]/50 blur-3xl" />
          <div className="absolute right-1/3 top-8 h-80 w-80 rounded-full bg-[#7CC99C]/22 blur-3xl" />
        </div>

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#CAE7D6] transition-transform duration-500 hover:translate-x-1">
              <Sparkles className="h-5 w-5 transition-transform duration-500 hover:scale-110 hover:rotate-12" />
              <span>Empresa tecnica en hidrocarburos</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight transition-transform duration-500 hover:translate-x-1">
              Asesoria tecnica, normativa y documental para proyectos de hidrocarburos.
            </h1>

            <p className="text-lg max-w-2xl text-white/85 transition-colors duration-500 hover:text-white">
              PETROCOM Energy acompana a sus clientes en la elaboracion de expedientes, gestion de tramites,
              levantamiento de observaciones y cumplimiento de requisitos tecnicos aplicables a combustibles liquidos,
              GLP, estaciones de servicio, consumidores directos y transporte de hidrocarburos.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/contacto" className="rounded-full bg-white px-6 py-3 font-bold text-[#07073b] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
                Coordinar asesoria
              </Link>
              <a href="#metodologia" className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-6 py-3 font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/18">
                Ver enfoque tecnico
              </a>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(35,138,85,0.10))] p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#CAE7D6]">Credenciales clave</p>
            <div className="space-y-3">
              {[
                { label: 'Rubro especializado', value: 'Hidrocarburos' },
                { label: 'Marco de gestion', value: 'Normativa tecnica' },
                { label: 'Atencion base', value: 'Huancayo' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-all duration-300 hover:translate-x-1 hover:bg-white/10">
                  <span className="text-sm text-white/80">{item.label}</span>
                  <span className="text-xl font-black text-white text-right">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/20 bg-white/15 p-4">
              <p className="text-sm text-white/85">
                Trabajamos con expedientes tecnicos, planes de contingencia, matrices de riesgo y documentos de soporte para actividades del sector combustibles y energia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="container-custom space-y-10 py-16 lg:py-20">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C58A2A] transition-transform duration-500 hover:translate-x-1">Nuestra esencia</p>
          <h2 className="max-w-4xl text-3xl font-black text-[#07073b] transition-transform duration-500 hover:translate-x-1 lg:text-4xl">
            Soluciones claras para tramites tecnicos, cumplimiento normativo y seguridad operativa.
          </h2>
          <p className="max-w-3xl text-lg text-[#303840] transition-colors duration-500 hover:text-[#07073b]">
            PETROCOM Energy es una empresa especializada en brindar asesoria tecnica, normativa y documental para el desarrollo de proyectos vinculados al sector hidrocarburos. Nuestro trabajo se centra en ordenar informacion, reducir observaciones y sostener cada gestion con criterio tecnico.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {companyPrinciples.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.key} className={`group relative overflow-hidden rounded-[32px] border border-white/80 bg-white ${item.ring} transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(35,50,116,0.16)]`}>
                <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${item.accent} px-7 py-5 text-white transition-all duration-500 group-hover:brightness-110`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_30%)]" />
                  <div className="absolute right-7 top-5 z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-colors duration-500 group-hover:bg-white/25">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="relative z-10 text-center text-4xl font-black leading-none text-white transition-transform duration-500 group-hover:-translate-y-1 md:text-5xl">
                    {item.summary}
                  </h3>
                </div>

                <div className="relative flex min-h-[230px] flex-col p-7">
                  <span className="inline-flex w-fit rounded-full bg-[#F4F5F6] px-3 py-1 text-xs font-bold text-[#5F6B76]">
                    {item.title}
                  </span>
                  <p className="mt-4 text-base leading-7 text-[#5F6B76]">{item.description}</p>
                  <div className="mt-auto pt-6">
                    <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-[#07073b] to-[#238A55]" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {experienceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="space-y-3 rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(35,138,85,0.16)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#238A55] text-white shadow-md transition-transform duration-500 hover:scale-110 hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-[#07073b]">{item.title}</h3>
                <p className="text-base text-[#303840]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="metodologia" className="border-y border-[#D7DCE1] bg-white">
        <div className="container-custom grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_auto] lg:py-20">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C58A2A] transition-transform duration-500 hover:translate-x-1">Enfoque tecnico</p>
            <h2 className="text-3xl font-black text-[#07073b] transition-transform duration-500 hover:translate-x-1 lg:text-4xl">Documentacion ordenada para reducir riesgos y observaciones</h2>
            <p className="max-w-3xl text-lg text-[#303840] transition-colors duration-500 hover:text-[#07073b]">
              Revisamos requisitos, definimos la ruta del tramite, elaboramos entregables tecnicos y damos seguimiento a cada hito. El objetivo es que el cliente tenga informacion clara y acciones concretas en cada etapa.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {capabilityPillars.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#D7DCE1] bg-[#F4F5F6] p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_rgba(35,50,116,0.08)]">
                  <div className="mb-2 flex items-center gap-2">
                    <Handshake className="h-4 w-4 text-[#C58A2A]" />
                    <h3 className="text-lg font-bold text-[#07073b]">{item.title}</h3>
                  </div>
                  <p className="text-sm text-[#303840]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-[#07073b]/40 bg-[#07073b] p-8 text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(15,27,53,0.28)]">
            <ShieldCheck className="mb-4 h-9 w-9 text-[#238A55]" />
            <h3 className="mb-4 text-2xl font-black">Necesitas iniciar o revisar un expediente?</h3>
            <p className="mb-6 text-white/80">
              Evaluamos tu caso, ordenamos requisitos y definimos los siguientes pasos para el tramite tecnico.
            </p>
            <Link to="/contacto" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-[#07073b] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
              Coordinar una llamada
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
