import { Award, CalendarClock, Check, FileCheck2, ShieldCheck, Users } from 'lucide-react';
import MotionTitle from '../../../shared/motion/MotionTitle';

const features = [
  {
    icon: ShieldCheck,
    number: '01',
    title: 'Cumplimiento y seguridad',
    description: 'Preparamos documentos tecnicos con foco en requisitos, distancias de seguridad, riesgos, contingencias y trazabilidad del expediente.',
  },
  {
    icon: FileCheck2,
    number: '02',
    title: 'Expedientes ordenados',
    description: 'Integramos planos, memorias, informes, matrices y documentos de soporte para ITF, Registro de Hidrocarburos y actividades GLP.',
  },
  {
    icon: CalendarClock,
    number: '03',
    title: 'Seguimiento tecnico',
    description: 'Acompanamos cada etapa: evaluacion inicial, elaboracion, presentacion, observaciones, subsanacion y cierre documental.',
  },
];

const stats = [
  { icon: Award, value: 'ITF', label: 'Ingenieria para infraestructura de hidrocarburos' },
  { icon: Users, value: 'GLP', label: 'Soporte para instalaciones y consumidores directos' },
  { icon: CalendarClock, value: '24h', label: 'Ruta inicial de atencion y revision de requisitos' },
];

const WhyUsSection = () => (
  <section id="nosotros" className="bg-white py-20 lg:py-28">
    <div className="container-custom">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#238A55]">
            Metodo Petrocom
          </p>
          <MotionTitle className="text-3xl font-black leading-tight text-[#07073b] sm:text-4xl lg:text-5xl">
            Control tecnico en cada etapa del expediente
          </MotionTitle>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#5F6B76]">
            Combinamos ingenieria, gestion documental y seguimiento para que cada decision tenga un sustento claro y verificable.
          </p>
          <div className="mt-8 flex items-center gap-3 border-l-4 border-[#C58A2A] pl-4 text-sm font-bold leading-6 text-[#303840]">
            <Check className="h-5 w-5 shrink-0 text-[#238A55]" />
            Un solo equipo acompana el proceso desde el diagnostico hasta el cierre.
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#D7DCE1] bg-[#F8F9FA] shadow-[0_16px_40px_rgba(7,7,59,0.07)]">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.number}
                className="group grid gap-5 border-b border-[#D7DCE1] px-6 py-8 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:px-8 sm:py-10 lg:px-10"
                data-motion-card
              >
                <div className="flex items-start justify-between sm:block">
                  <span className="text-sm font-black text-[#C58A2A]">{feature.number}</span>
                  <Icon className="mt-4 h-8 w-8 text-[#238A55] transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#07073b]">{feature.title}</h3>
                  <p className="mt-3 max-w-2xl leading-7 text-[#5F6B76]">{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-16 grid border border-[#D7DCE1] md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.value}
              className={`p-7 md:p-8 ${index ? 'border-t border-[#D7DCE1] md:border-l md:border-t-0' : ''}`}
              data-motion-card
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#07073b] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-3xl font-black text-[#238A55]">{stat.value}</span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#5F6B76]">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default WhyUsSection;
