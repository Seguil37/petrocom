import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, ClipboardCheck, Eye, Layers, MapPin, ShieldCheck, Target, Wrench } from 'lucide-react';
import { usePublicMotion } from '../../../shared/motion/publicMotionContext';
import useAboutMotion from '../useAboutMotion';
import grifosLarge from '../../../assets/images/about/station-1536.webp';
import grifosSmall from '../../../assets/images/about/station-800.webp';
import registroLarge from '../../../assets/images/about/engineering-1536.webp';
import registroSmall from '../../../assets/images/about/engineering-800.webp';
import glpLarge from '../../../assets/images/about/glp-1536.webp';
import glpSmall from '../../../assets/images/about/glp-800.webp';
import transporteLarge from '../../../assets/images/about/transport-1536.webp';
import transporteSmall from '../../../assets/images/about/transport-800.webp';
import itfLarge from '../../../assets/images/about/itf-original.webp';
import itfSmall from '../../../assets/images/about/itf-800.webp';
import consumidoresLarge from '../../../assets/images/about/consumers-original.webp';
import consumidoresSmall from '../../../assets/images/about/consumers-800.webp';
import './AboutPage.css';

const images = {
  // The same six source images as FeaturedToursSection, in optimized WebP copies.
  energy: { large: grifosLarge, small: grifosSmall, width: 1536, height: 1024 },
  engineering: { large: registroLarge, small: registroSmall, width: 1024, height: 1024 },
  station: { large: consumidoresLarge, small: consumidoresSmall, width: 1536, height: 1024 },
  glp: { large: glpLarge, small: glpSmall, width: 1024, height: 1024 },
  transport: { large: transporteLarge, small: transporteSmall, width: 1536, height: 1024 },
  itf: { large: itfLarge, small: itfSmall, width: 1536, height: 1024 },
};

const capabilities = [
  { title: 'Experiencia técnica', text: 'Analizamos la actividad, el tipo de establecimiento y los requisitos aplicables antes de estructurar cada expediente.', icon: Wrench },
  { title: 'Gestión normativa', text: 'Ordenamos documentación para ITF, Registro de Hidrocarburos, GLP, consumidores directos y transporte de combustibles.', icon: ClipboardCheck },
  { title: 'Acompañamiento integral', text: 'Damos seguimiento desde la evaluación inicial hasta la presentación, observaciones, subsanación y cierre del trámite.', icon: Layers },
];

const commitments = [
  { title: 'Cumplimiento ante entidades competentes', text: 'Preparamos expedientes claros para su revisión, seguimiento y levantamiento de observaciones.', icon: ClipboardCheck },
  { title: 'Compromiso con la seguridad', text: 'Priorizamos planes de contingencia, matrices de riesgo, procedimientos y medidas de control.', icon: ShieldCheck },
  { title: 'Atención personalizada', text: 'Definimos rutas de trabajo según actividad: grifo, estación, GLP, consumidor directo o transporte.', icon: Target },
];

function SectorImage({ image, alt = '', eager = false, sizes = '100vw', className = '' }) {
  const source = images[image];
  return (
    <img className={className} src={source.large} srcSet={`${source.small} 800w, ${source.large} ${source.width}w`}
      sizes={sizes} alt={alt} width={source.width} height={source.height}
      loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
  );
}

function SectionLabel({ number, children }) {
  return <p className="pc-label"><span>{number}</span>{children}</p>;
}

function RevealHeading({ first, second, id }) {
  return <h2 id={id} data-about-heading aria-label={`${first} ${second}`}><span className="pc-heading-mask"><span data-about-heading-line>{first}</span></span><span className="pc-heading-mask"><em data-about-heading-line>{second}</em></span></h2>;
}

function ContactButton({ children = 'Coordinar asesoría' }) {
  return <Link className="pc-button" to="/contacto"><span>{children}</span><ArrowUpRight size={20} aria-hidden="true" /></Link>;
}

function PurposePanel({ number, title, image, icon: Icon, children, detail }) {
  return (
    <article className="pc-purpose-panel" data-about-reveal>
      <SectorImage image={image} sizes="(max-width: 760px) 100vw, 50vw" />
      <div className="pc-purpose-shade" />
      <div className="pc-purpose-copy">
        <div className="pc-purpose-top"><span>{number} / {title}</span><Icon size={29} strokeWidth={1.4} aria-hidden="true" /></div>
        <h3>{children}</h3><p>{detail}</p>
      </div>
    </article>
  );
}

export default function AboutPage() {
  const root = useRef(null);
  const { scrollTo } = usePublicMotion();
  useAboutMotion(root);

  return (
    <div className="pc-about" ref={root}>
      <div className="pc-reading-progress" aria-hidden="true" />
      <section className="pc-hero" aria-labelledby="pc-about-title">
        <div className="pc-hero-media" data-about-parallax><SectorImage image="energy" eager /></div>
        <div className="pc-hero-shade" />
        <div className="pc-hero-grid" aria-hidden="true" />
        <div className="pc-shell pc-hero-content">
          <p className="pc-hero-eyebrow" data-about-hero-item><span /> PETROCOM ENERGY <b>/</b> NOSOTROS</p>
          <h1 id="pc-about-title" className="pc-hero-title" aria-label="Energía que impulsa el futuro.">
            <span><span data-about-title-line>ENERGÍA QUE</span></span>
            <span><span data-about-title-line>IMPULSA EL</span></span>
            <span><span data-about-title-line className="pc-title-accent">FUTURO.</span></span>
          </h1>
          <div className="pc-hero-summary" data-about-hero-item>
            <span className="pc-hero-rule" aria-hidden="true" />
            <p>Asesoría técnica, normativa y documental para proyectos de hidrocarburos. Claridad en cada requisito. Criterio en cada decisión.</p>
          </div>
          <div className="pc-hero-actions" data-about-hero-item>
            <ContactButton />
            <a href="#nosotros" className="pc-text-link" onClick={(event) => { event.preventDefault(); scrollTo('#nosotros'); }}>Explorar nuestra empresa <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="pc-shell pc-hero-bottom" data-about-hero-item>
          <span><MapPin size={14} aria-hidden="true" /> HUANCAYO, PERÚ</span>
          <a className="pc-scroll-cue" href="#nosotros" aria-label="Desplazarse a Sobre nosotros" onClick={(event) => { event.preventDefault(); scrollTo('#nosotros'); }}><span>DESCUBRE NUESTRO ENFOQUE</span><ArrowDown size={17} aria-hidden="true" /></a>
          <span className="pc-hero-sector">INGENIERÍA / ENERGÍA / GESTIÓN</span>
        </div>
      </section>

      <section id="nosotros" className="pc-shell pc-editorial">
        <div className="pc-editorial-visual" data-about-image-reveal>
          <SectorImage image="engineering" alt="Revisión técnica para el Registro de Hidrocarburos" sizes="(max-width: 760px) 100vw, 45vw" />
          <div className="pc-image-marker" aria-hidden="true"><span /><span /></div>
          <p className="pc-image-caption">CRITERIO TÉCNICO EN CADA ETAPA <span>01 /</span></p>
        </div>
        <div className="pc-editorial-copy">
          <div data-about-reveal><SectionLabel number="01">NUESTRA ESENCIA</SectionLabel><RevealHeading first="Ordenamos lo complejo." second="Impulsamos lo que sigue." /></div>
          <p className="pc-lead" data-about-reveal>PETROCOM Energy es una empresa especializada en asesoría técnica, normativa y documental para el desarrollo de proyectos vinculados al sector hidrocarburos.</p>
          <p data-about-reveal>Nuestro trabajo se centra en ordenar información, reducir observaciones y sostener cada gestión con criterio técnico. Acompañamos la elaboración de expedientes, la gestión de trámites y el cumplimiento de requisitos para combustibles líquidos, GLP, estaciones de servicio, consumidores directos y transporte de hidrocarburos.</p>
          <dl className="pc-facts" data-about-reveal>
            <div><dt>Especialidad</dt><dd>Hidrocarburos</dd></div><div><dt>Marco de gestión</dt><dd>Normativa técnica</dd></div><div><dt>Atención base</dt><dd>Huancayo</dd></div>
          </dl>
        </div>
      </section>

      <section className="pc-immersion" aria-labelledby="pc-immersion-title">
        <div className="pc-immersion-media" data-about-panorama><SectorImage image="station" /></div>
        <div className="pc-immersion-shade" />
        <div className="pc-shell pc-immersion-copy" data-about-reveal>
          <SectionLabel number="+">NUESTRO ENFOQUE</SectionLabel>
          <h2 id="pc-immersion-title">Criterio técnico.<br />Cumplimiento normativo.<br /><em>Seguridad operativa.</em></h2>
          <span className="pc-immersion-foot">SOLUCIONES CLARAS PARA EL SECTOR HIDROCARBUROS</span>
        </div>
      </section>

      <section className="pc-shell pc-purpose">
        <div className="pc-section-heading" data-about-reveal><SectionLabel number="02">NUESTRO PROPÓSITO</SectionLabel><RevealHeading first="Una dirección clara." second="Un compromiso compartido." /></div>
        <div className="pc-purpose-grid">
          <PurposePanel number="01" title="MISIÓN" image="glp" icon={Target} detail="Facilitar el cumplimiento normativo y la correcta gestión de trámites.">Brindar soluciones técnicas y documentales confiables para proyectos de hidrocarburos.</PurposePanel>
          <PurposePanel number="02" title="VISIÓN" image="transport" icon={Eye} detail="Para actividades de hidrocarburos a nivel regional y nacional.">Ser una empresa referente en asesoría y gestión técnica.</PurposePanel>
        </div>
      </section>

      <section className="pc-expertise">
        <div className="pc-shell">
          <div className="pc-section-heading" data-about-reveal><SectionLabel number="03">LO QUE NOS DEFINE</SectionLabel><RevealHeading first="La confianza se construye" second="con criterio." /></div>
          <div className="pc-capabilities">{capabilities.map(({ title, text, icon: Icon }, index) => <article key={title} data-about-reveal><div className="pc-capability-top"><Icon size={27} strokeWidth={1.4} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="pc-commitments">
            <div className="pc-commitment-photo" data-about-image-reveal><SectorImage image="itf" alt="Evaluación de instalaciones para un Informe Técnico Favorable" sizes="(max-width: 760px) 100vw, 35vw" /><span>SEGURIDAD + CUMPLIMIENTO</span></div>
            <div className="pc-commitment-list">{commitments.map(({ title, text, icon: Icon }) => <article key={title} data-about-reveal><Icon size={22} strokeWidth={1.5} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          </div>
        </div>
      </section>

      <section id="metodologia" className="pc-shell pc-method">
        <div data-about-reveal><SectionLabel number="04">ENFOQUE TÉCNICO</SectionLabel><RevealHeading first="Documentación ordenada." second="Menos riesgos y observaciones." /></div>
        <div className="pc-method-copy" data-about-reveal><p>Revisamos requisitos, definimos la ruta del trámite, elaboramos entregables técnicos y damos seguimiento a cada hito. El objetivo es que tengas información clara y acciones concretas en cada etapa.</p><p>Trabajamos con expedientes técnicos, planes de contingencia, matrices de riesgo y documentos de soporte para actividades del sector combustibles y energía.</p><Link to="/contacto" className="pc-inline-link">Conversemos sobre tu expediente <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </section>

      <section className="pc-final" aria-labelledby="pc-final-title">
        <div className="pc-final-media" data-about-parallax><SectorImage image="energy" /></div><div className="pc-final-shade" />
        <div className="pc-shell pc-final-content" data-about-reveal><SectionLabel number="→">EL SIGUIENTE PASO</SectionLabel><h2 id="pc-final-title">Tu proyecto.<br />Nuestra <em>atención.</em></h2><p>¿Necesitas iniciar o revisar un expediente? Evaluamos tu caso, ordenamos requisitos y definimos los siguientes pasos para el trámite técnico.</p><ContactButton>Coordinar una llamada</ContactButton></div>
        <div className="pc-shell pc-final-foot"><span>PETROCOM ENERGY</span><span>ASESORÍA TÉCNICA EN HIDROCARBUROS</span></div>
      </section>
    </div>
  );
}
