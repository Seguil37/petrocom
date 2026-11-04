import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Clock, Facebook, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { usePublicMotion } from '../../motion/publicMotionContext';
import petrocomLogo from '../../../assets/images/petrocom-logo.png';
import './Footer.css';

const WHATSAPP_URL = 'https://wa.me/51927985691?text=Hola%20PETROCOM%20Energy%2C%20necesito%20asesoria%20para%20un%20tramite%20de%20hidrocarburos.';
const services = [
  'Informe Técnico Favorable - ITF',
  'Registro de Hidrocarburos',
  'Grifos y estaciones de servicio',
  'Gasocentros y GLP',
  'Transporte de combustibles',
];
const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Proyectos y categorías', to: '/projects' },
  { label: 'Empresa', to: '/about' },
  { label: 'Consulta de trámite', to: '/consulta-tramite' },
  { label: 'Contacto', to: '/contacto' },
];

export default function Footer() {
  const { scrollTo } = usePublicMotion();
  return (
    <footer className="petro-footer">
      <div className="ft-shell">
        <div className="ft-topline"><span><i aria-hidden="true" />INGENIERÍA. SEGURIDAD. GESTIÓN.</span><button type="button" onClick={() => scrollTo(0)} aria-label="Volver al inicio de la página">Volver arriba <ArrowUp size={15} aria-hidden="true" /></button></div>

        <div className="ft-grid">
          <div className="ft-brand">
            <Link to="/" className="ft-logo" aria-label="PETROCOM Energy, inicio"><img src={petrocomLogo} alt="PETROCOM Energy" width="160" height="66" loading="lazy" /></Link>
            <p>Servicios técnicos para hidrocarburos: ITF, Registro de Hidrocarburos, expedientes, planes de contingencia y seguimiento de trámites ante entidades competentes.</p>
            <div className="ft-socials"><a href="https://www.facebook.com/profile.php?id=61574640909224" target="_blank" rel="noopener noreferrer" aria-label="Facebook de PETROCOM Energy"><Facebook size={17} aria-hidden="true" /></a><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Escribir a PETROCOM Energy por WhatsApp"><MessageCircle size={17} aria-hidden="true" /></a><span>Conecta con PETROCOM</span></div>
          </div>

          <nav className="ft-nav" aria-labelledby="ft-services-title"><h3 id="ft-services-title">NUESTROS SERVICIOS</h3><ul>{services.map((service) => <li key={service}><Link to="/services">{service}</Link></li>)}</ul></nav>
          <nav className="ft-nav" aria-labelledby="ft-company-title"><h3 id="ft-company-title">EXPLORA PETROCOM</h3><ul>{navigation.map(({ label, to }) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></nav>

          <div className="ft-contact"><h3>HABLEMOS DE TU PROYECTO</h3><a href="tel:+51927985691" className="ft-phone"><Phone size={19} strokeWidth={1.5} aria-hidden="true" /><span>+51 927 985 691</span><ArrowUpRight size={17} aria-hidden="true" /></a><a href="mailto:iaosoress@gmail.com" className="ft-contact-row"><Mail size={16} aria-hidden="true" /><span>iaosoress@gmail.com</span></a><Link to="/contacto#ubicacion" className="ft-contact-row"><MapPin size={17} aria-hidden="true" /><span>Jr. Chiclayo 345, El Tambo<br />Huancayo, Junín</span></Link><div className="ft-contact-row"><Clock size={16} aria-hidden="true" /><span>Lun – Vie · 9:00 AM – 6:00 PM</span></div><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ft-whatsapp">Conversemos por WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </div>

        <div className="ft-bottom"><p>© {new Date().getFullYear()} PETROCOM Energy. Todos los derechos reservados.</p><div><span>HUANCAYO, PERÚ</span><Link to="/contacto">Contacto <ArrowUpRight size={13} aria-hidden="true" /></Link></div></div>
      </div>
    </footer>
  );
}
