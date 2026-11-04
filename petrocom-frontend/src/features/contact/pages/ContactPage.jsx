import { useRef } from 'react';
import { ArrowDown, ArrowUpRight, Facebook, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { usePublicMotion } from '../../../shared/motion/publicMotionContext';
import useContactMotion from '../useContactMotion';
import projectImage from '../../../assets/images/about/itf-original.webp';
import projectImageSmall from '../../../assets/images/about/itf-800.webp';
import './ContactPage.css';

const WHATSAPP_URL = 'https://wa.me/51927985691?text=Hola%20PETROCOM%20Energy%2C%20necesito%20asesoria%20para%20un%20tramite%20de%20hidrocarburos.';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61574640909224';
const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=-12.059395,-75.212822';

const contactDetails = [
  { label: 'TELÉFONO / WHATSAPP', value: '+51 927 985 691', href: 'tel:+51927985691', icon: Phone },
  { label: 'CORREO ELECTRÓNICO', value: 'iaosoress@gmail.com', href: 'mailto:iaosoress@gmail.com', icon: Mail },
  { label: 'UBICACIÓN BASE', value: 'El Tambo, Huancayo', href: '#ubicacion', icon: MapPin },
];

const conversationTopics = [
  { title: 'Tu actividad', description: 'Estación de servicio, grifo, GLP, consumidor directo o transporte de combustibles.' },
  { title: 'Tu trámite', description: 'ITF, Registro de Hidrocarburos, expediente técnico o levantamiento de observaciones.' },
  { title: 'Tu punto de partida', description: 'Cuéntanos en qué etapa estás y qué necesitas revisar, iniciar o resolver.' },
];

function WhatsAppButton({ children = 'Escribir por WhatsApp', light = false }) {
  return <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`ct-button${light ? ' ct-button-light' : ''}`}><MessageCircle size={18} aria-hidden="true" /><span>{children}</span><ArrowUpRight size={19} aria-hidden="true" /></a>;
}

function ContactLabel({ number, children }) {
  return <p className="ct-label"><span>{number}</span>{children}</p>;
}

export default function ContactPage() {
  const root = useRef(null);
  const { scrollTo } = usePublicMotion();
  useContactMotion(root);
  const showLocation = (event) => { event.preventDefault(); scrollTo('#ubicacion'); };

  return (
    <div className="contact-page" ref={root}>
      <section className="ct-hero" aria-labelledby="ct-title">
        <div className="ct-hero-guides" aria-hidden="true" />
        <div className="ct-shell ct-hero-grid">
          <div className="ct-hero-copy">
            <p className="ct-eyebrow" data-contact-intro><span />PETROCOM ENERGY <b>/</b> CONTACTO</p>
            <h1 id="ct-title" aria-label="Hablemos de tu proyecto.">
              <span className="ct-title-mask"><span data-contact-title>HABLEMOS</span></span>
              <span className="ct-title-mask"><span data-contact-title>DE TU</span></span>
              <span className="ct-title-mask"><span data-contact-title className="ct-title-mint">PROYECTO.</span></span>
            </h1>
            <p className="ct-hero-description" data-contact-intro>Un expediente claro empieza con una conversación. Cuéntanos tu trámite o proyecto de hidrocarburos y definamos el siguiente paso.</p>
            <div className="ct-hero-actions" data-contact-intro><WhatsAppButton light /><a href="#ubicacion" onClick={showLocation} className="ct-button ct-button-outline"><MapPin size={18} aria-hidden="true" /><span>Ver ubicación</span><ArrowDown size={18} aria-hidden="true" /></a></div>
          </div>

          <aside className="ct-direct" aria-label="Canales de atención directa">
            <ContactLabel number="01">ATENCIÓN DIRECTA</ContactLabel>
            {contactDetails.map(({ label, value, href, icon: Icon }) => <a key={label} className="ct-direct-row" href={href} onClick={href.startsWith('#') ? showLocation : undefined} data-contact-intro><Icon size={23} strokeWidth={1.4} aria-hidden="true" /><div><span>{label}</span><strong>{value}</strong></div><ArrowUpRight size={18} aria-hidden="true" /></a>)}
            <p className="ct-direct-note" data-contact-intro>Asesoría técnica, normativa y documental para el sector hidrocarburos.</p>
          </aside>
        </div>
        <div className="ct-shell ct-hero-foot" data-contact-intro><span><MapPin size={13} aria-hidden="true" /> HUANCAYO, PERÚ</span><span>INGENIERÍA / SEGURIDAD / GESTIÓN</span></div>
      </section>

      <section className="ct-shell ct-conversation" aria-labelledby="ct-conversation-title">
        <div className="ct-photo" data-contact-image>
          <img src={projectImage} srcSet={`${projectImageSmall} 800w, ${projectImage} 1536w`} sizes="(max-width: 760px) 100vw, 35vw" width="1536" height="1024" loading="lazy" decoding="async" alt="Estación de servicio e infraestructura de almacenamiento de combustibles" />
          <div className="ct-photo-caption"><span>CRITERIO TÉCNICO</span><span>EN CADA ETAPA ↗</span></div>
        </div>
        <div className="ct-conversation-copy">
          <div data-contact-reveal><ContactLabel number="02">PARA EMPEZAR</ContactLabel><h2 id="ct-conversation-title">El primer paso:<br /><em>conocer tu caso.</em></h2><p className="ct-lead">Te orientamos en ITF, Registro de Hidrocarburos, GLP, estaciones de servicio, consumidores directos, transporte de combustibles y levantamiento de observaciones.</p></div>
          <div className="ct-topic-list">{conversationTopics.map(({ title, description }, index) => <article key={title} data-contact-reveal><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
        </div>
      </section>

      <section className="ct-location" aria-labelledby="ct-location-title">
        <div className="ct-shell">
          <div className="ct-location-heading" data-contact-reveal><div><ContactLabel number="03">NUESTRA UBICACIÓN</ContactLabel><h2 id="ct-location-title">Nos encuentras aquí.<br /><em>El Tambo, Huancayo.</em></h2></div><a className="ct-button ct-button-light" href={MAP_URL} target="_blank" rel="noopener noreferrer"><Navigation size={18} aria-hidden="true" /><span>Cómo llegar</span><ArrowUpRight size={18} aria-hidden="true" /></a></div>
          <div id="ubicacion" className="ct-location-grid">
            <div className="ct-location-info" data-contact-reveal>
              <div className="ct-address"><MapPin size={29} strokeWidth={1.4} aria-hidden="true" /><p className="ct-address-label">PETROCOM ENERGY</p><h3>Jr. Chiclayo 345,<br />El Tambo.</h3><p>Huancayo, Junín, Perú</p></div>
              <div className="ct-location-contacts"><a href="tel:+51927985691"><Phone size={17} aria-hidden="true" /><span>+51 927 985 691</span><ArrowUpRight size={16} aria-hidden="true" /></a><a href="mailto:iaosoress@gmail.com"><Mail size={17} aria-hidden="true" /><span>iaosoress@gmail.com</span><ArrowUpRight size={16} aria-hidden="true" /></a></div>
              <div className="ct-social-links"><a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"><Facebook size={17} aria-hidden="true" />Facebook <ArrowUpRight size={15} aria-hidden="true" /></a><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a></div>
            </div>
            <div className="ct-map"><iframe src="https://maps.google.com/maps?q=-12.059395%2C-75.212822&t=&z=18&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación de PETROCOM Energy en El Tambo, Huancayo" /><a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="ct-map-link">Abrir en Google Maps <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          </div>
        </div>
      </section>

      <section className="ct-closing" aria-labelledby="ct-closing-title"><div className="ct-shell ct-closing-grid"><div data-contact-reveal><ContactLabel number="→">CONVERSEMOS</ContactLabel><h2 id="ct-closing-title">Demos el<br /><em>siguiente paso.</em></h2><p>Evaluamos tu caso, ordenamos requisitos y definimos una ruta de trabajo clara.</p></div><div className="ct-closing-actions" data-contact-reveal><WhatsAppButton light /><a href="tel:+51927985691" className="ct-text-link">Prefiero llamar <Phone size={16} aria-hidden="true" /></a></div></div></section>
    </div>
  );
}
