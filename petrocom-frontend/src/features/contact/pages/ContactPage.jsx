import { Mail, MapPin, Phone, Facebook, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/51927985691?text=Hola%20PETROCOM%20Energy%2C%20necesito%20asesoria%20para%20un%20tramite%20de%20hidrocarburos.';

const contactChannels = [
  {
    title: 'Escribenos',
    description: 'Cuentanos tu tramite o proyecto y recibe una ruta de trabajo clara.',
    value: 'iaosoress@gmail.com',
    href: 'mailto:iaosoress@gmail.com',
    icon: Mail,
    accent: 'from-[#07073b] via-[#10104d] to-[#2f4098]',
  },
  {
    title: 'Llamanos',
    description: 'Habla directamente con el equipo para coordinar una evaluacion inicial.',
    value: '+51 927 985 691',
    href: 'tel:+51927985691',
    icon: Phone,
    accent: 'from-[#2a5f9d] via-[#3f7ec0] to-[#238A55]',
  },
  {
    title: 'Visitanos',
    description: 'Atendemos desde Huancayo para proyectos tecnicos del sector hidrocarburos.',
    value: 'El Tambo, Huancayo',
    href: null,
    icon: MapPin,
    accent: 'from-[#303840] via-[#5F6B76] to-[#C58A2A]',
  },
];

const socialLinks = [
  {
    label: 'Siguenos en Facebook',
    href: 'https://www.facebook.com/profile.php?id=61574640909224',
    icon: Facebook,
    bg: 'bg-[#07073b] hover:bg-[#10104d]',
  },
  {
    label: 'Escribenos por WhatsApp',
    href: WHATSAPP_URL,
    icon: MessageCircle,
    bg: 'bg-[#238A55] hover:bg-[#196B43]',
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(7,7,59,0.12),_transparent_30%),linear-gradient(180deg,#F4F5F6_0%,#F3EFE6_100%)] pb-14">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#07073b_0%,#10104d_42%,#238A55_82%,#303840_100%)] text-white py-16">
        <div className="absolute inset-0 opacity-16" aria-hidden>
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#C58A2A] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#238A55]/42 blur-3xl" />
          <div className="absolute right-1/3 top-8 h-80 w-80 rounded-full bg-[#7CC99C]/18 blur-3xl" />
        </div>

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EFE6] transition-transform duration-500 hover:translate-x-1">
              <Sparkles className="h-4 w-4 transition-transform duration-500 hover:scale-110 hover:rotate-12" />
              Contacto PETROCOM
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight transition-transform duration-500 hover:translate-x-1">
              Hablemos de tu expediente o proyecto de hidrocarburos.
            </h1>

            <p className="text-lg max-w-2xl text-white/88 transition-colors duration-500 hover:text-white">
              Te orientamos en ITF, Registro de Hidrocarburos, GLP, estaciones de servicio, consumidores directos,
              transporte de combustibles y levantamiento de observaciones.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#07073b] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                Escribir por WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#ubicacion" className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                Ver ubicacion
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(35,138,85,0.10))] p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F3EFE6]">Atencion directa</p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Telefono / WhatsApp', value: '927985691' },
                { label: 'Ubicacion base', value: 'Huancayo' },
                { label: 'Especialidad', value: 'Hidrocarburos' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 px-4 py-3 transition-all duration-300 hover:bg-white/14">
                  <span className="text-sm text-white/80">{item.label}</span>
                  <span className="text-lg font-black text-white text-right">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85">
              Atendemos consultas sobre expedientes tecnicos, ITF, GLP, combustibles liquidos y transporte de hidrocarburos.
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom -mt-8 relative z-10 space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactChannels.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="group overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(77,58,31,0.10)] transition-all duration-500 hover:-translate-y-2">
                <div className={`h-24 bg-gradient-to-br ${item.accent} px-6 py-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black">{item.title}</p>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <p className="text-sm leading-6 text-[#5F6B76]">{item.description}</p>
                  {item.href ? (
                    <a href={item.href} className="inline-flex items-center gap-2 rounded-full bg-[#F4F5F6] px-4 py-2 text-sm font-bold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F4F5F6]">
                      {item.value}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F5F6] px-4 py-2 text-sm font-bold text-[#07073b]">
                      {item.value}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div id="ubicacion" className="overflow-hidden rounded-[34px] border border-[#D7DCE1] bg-white shadow-[0_25px_70px_rgba(77,58,31,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#F4F5F6_100%)] p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C58A2A]">Nuestra ubicacion</p>
                  <h2 className="mt-3 text-3xl font-black text-[#07073b]">PETROCOM Energy</h2>
                  <p className="mt-2 text-sm font-medium text-[#5F6B76]">Servicios tecnicos para hidrocarburos</p>
                </div>

                <div className="rounded-[28px] border border-[#D7DCE1] bg-white p-6 shadow-sm">
                  <div className="space-y-5">
                    <Info icon={MapPin} label="Direccion">
                      Jr. Chiclayo 345, El Tambo
                      <br />
                      Huancayo, Junin
                    </Info>
                    <Info icon={Phone} label="Telefono">
                      <a href="tel:+51927985691" className="mt-1 inline-flex text-sm font-bold text-[#238A55] transition-colors hover:text-[#C58A2A]">
                        +51 927 985 691
                      </a>
                    </Info>
                    <Info icon={Mail} label="Correo">
                      <a href="mailto:iaosoress@gmail.com" className="mt-1 inline-flex break-all text-sm font-bold text-[#238A55] transition-colors hover:text-[#C58A2A]">
                        iaosoress@gmail.com
                      </a>
                    </Info>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#D7DCE1] bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors ${item.bg}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-semibold text-[#07073b]">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#07073b]/80 to-transparent px-6 py-5 text-white">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EFE6]">Mapa</p>
                  <p className="mt-1 text-lg font-black">Encuentranos en El Tambo</p>
                </div>
              </div>
              <iframe
                src="https://maps.google.com/maps?q=-12.059395%2C-75.212822&t=&z=18&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PETROCOM Energy ubicacion"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Info = ({ icon: Icon, label, children }) => (
  <div className="flex gap-4">
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#F4F5F6]">
      <Icon className="h-5 w-5 text-[#238A55]" />
    </div>
    <div>
      <p className="text-sm font-semibold text-[#5F6B76]">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#07073b]">{children}</p>
    </div>
  </div>
);

export default ContactPage;
