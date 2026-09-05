// src/features/tours/components/PopularCountriesSection.jsx

import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Fuel, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import MotionTitle from '../../../shared/motion/MotionTitle';
import informeTecnicoImage from '../../../assets/images/servicios-principales/informe_tecnico_favorable_itf.png';
import registroHidrocarburosImage from '../../../assets/images/servicios-principales/registro_de_hidrocarburos.png';
import grifosEstacionesImage from '../../../assets/images/servicios-principales/grifos_estaciones_servicio.png';
import gasocentrosGlpImage from '../../../assets/images/servicios-principales/gasocentros_glp.png';
import consumidoresDirectosImage from '../../../assets/images/servicios-principales/consumidores_directos.png';
import transporteCombustiblesImage from '../../../assets/images/servicios-principales/transporte_combustibles.png';
import planesContingenciaImage from '../../../assets/images/servicios-principales/planes_de_contingencia.png';
import levantamientoObservacionesImage from '../../../assets/images/servicios-principales/levantamiento_observaciones.png';

gsap.registerPlugin(Draggable);

const services = [
  {
    name: 'Informe Tecnico Favorable - ITF',
    subtitle: 'Instalacion, modificacion o ampliacion de infraestructura de hidrocarburos.',
    image: informeTecnicoImage,
    category: 'Ingenieria y seguridad',
  },
  {
    name: 'Registro de Hidrocarburos',
    subtitle: 'Inscripcion, modificacion y actualizacion de registros ante OSINERGMIN.',
    image: registroHidrocarburosImage,
    category: 'Gestion regulatoria',
  },
  {
    name: 'Grifos y estaciones de servicio',
    subtitle: 'Expedientes para combustibles liquidos, tanques, islas y zonas de descarga.',
    image: grifosEstacionesImage,
    category: 'Infraestructura',
  },
  {
    name: 'Gasocentros y GLP',
    subtitle: 'Soporte tecnico para almacenamiento, despacho y venta de GLP.',
    image: gasocentrosGlpImage,
    category: 'Especialidad GLP',
  },
  {
    name: 'Consumidores directos',
    subtitle: 'Documentacion para almacenamiento y consumo propio de combustibles.',
    image: consumidoresDirectosImage,
    category: 'Operacion segura',
  },
  {
    name: 'Transporte de combustibles',
    subtitle: 'Planes, matrices y requisitos para unidades de transporte terrestre.',
    image: transporteCombustiblesImage,
    category: 'Transporte',
  },
  {
    name: 'Planes de contingencia',
    subtitle: 'Riesgos, emergencias, senalizacion y procedimientos operativos.',
    image: planesContingenciaImage,
    category: 'Seguridad',
  },
  {
    name: 'Levantamiento de observaciones',
    subtitle: 'Descargos tecnicos, subsanaciones y planos corregidos.',
    image: levantamientoObservacionesImage,
    category: 'Subsanacion tecnica',
  },
];

const PopularCountriesSection = () => {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const ring = ringRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!section || !scene || !ring || cards.length === 0) return undefined;

    let refreshFrame = 0;
    let rotation = 0;
    let degreesPerPixel = 0;
    let snapTween;
    let autoplayTween;
    const surfaces = cards.map((card) => card.querySelector('[data-ring-card-surface]'));
    const links = cards.map((card) => card.querySelector('a'));
    const previousButton = section.querySelector('[data-ring-prev]');
    const nextButton = section.querySelector('[data-ring-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fullCircle = 360;
    const angleStep = fullCircle / cards.length;

    const updateCardFocus = () => {
      const ringRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
      const cardAngles = cards.map((_, index) =>
        gsap.utils.wrap(-180, 180, index * angleStep + ringRotation),
      );
      const activeIndex = cardAngles.reduce(
        (closestIndex, angle, index) =>
          Math.abs(angle) < Math.abs(cardAngles[closestIndex]) ? index : closestIndex,
        0,
      );
      const hiddenLimit = Math.min(80, angleStep * 2.25);

      cards.forEach((card, index) => {
        const angularDistance = Math.abs(cardAngles[index]);
        const distanceInCards = angularDistance / angleStep;
        const isActive = index === activeIndex;
        const isVisible = angularDistance < hiddenLimit;
        const frontProgress = Math.min(1, distanceInCards);
        const fadeRange = Math.max(0.5, hiddenLimit / angleStep - 1);
        const fade = Math.max(0, 1 - (distanceInCards - 1) / fadeRange);
        const opacity = isVisible ? (1 - frontProgress * 0.28) * Math.min(1, fade) : 0;
        const scale =
          1 - frontProgress * 0.08 - Math.min(1, Math.max(0, distanceInCards - 1)) * 0.04;
        const brightness = 1 - frontProgress * 0.25;
        const surface = surfaces[index];

        if (surface) {
          surface.style.opacity = String(opacity);
          surface.style.transform = `scale(${scale})`;
          surface.style.filter = `brightness(${brightness})`;
        }

        card.style.visibility = isVisible ? 'visible' : 'hidden';
        card.style.pointerEvents = isActive ? 'auto' : 'none';
        card.setAttribute('aria-hidden', String(!isActive));
        if (links[index]) links[index].tabIndex = isActive ? 0 : -1;
      });
    };

    const positionCards = () => {
      const cardWidth = cards[0].offsetWidth;
      const baseRadius =
        cards.length > 2 ? cardWidth / (2 * Math.tan(Math.PI / cards.length)) : cardWidth;
      const separation =
        Number(getComputedStyle(scene).getPropertyValue('--ring-separation')) || 0.96;
      const ringRadius = Math.ceil(baseRadius * separation);
      degreesPerPixel = angleStep / (cardWidth * 0.65);

      cards.forEach((card, index) => {
        const cardAngle = index * angleStep;
        card.dataset.ringAngle = String(cardAngle);
        card.style.setProperty('--card-angle', `${cardAngle}deg`);
      });

      scene.style.setProperty('--ring-radius', `${ringRadius}px`);
      gsap.set(ring, { z: -ringRadius, force3D: true });
      updateCardFocus();
    };

    const stopAutoplay = () => {
      autoplayTween?.kill();
      autoplayTween = undefined;
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTween = gsap.to(ring, {
        rotationY: '-=360',
        duration: cards.length * 5,
        ease: 'none',
        repeat: -1,
        force3D: true,
        overwrite: true,
        onUpdate: updateCardFocus,
      });
    };

    const snapTo = (targetRotation) => {
      snapTween?.kill();
      snapTween = gsap.to(ring, {
        rotationY: targetRotation,
        duration: reducedMotion.matches ? 0 : 0.7,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: updateCardFocus,
        onComplete: () => {
          rotation = gsap.utils.wrap(-180, 180, targetRotation);
          gsap.set(ring, { rotationY: rotation });
          updateCardFocus();
          startAutoplay();
        },
      });
    };

    const scheduleLayout = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(positionCards);
    };

    const ctx = gsap.context(() => {
      const dragProxy = document.createElement('div');
      dragProxy.setAttribute('aria-hidden', 'true');
      dragProxy.style.cssText =
        'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;pointer-events:none;';
      document.body.appendChild(dragProxy);

      gsap.set(ring, {
        rotationY: 0,
        transformOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        force3D: true,
      });

      let pressX = 0;
      let pressRotation = 0;
      const draggable = Draggable.create(dragProxy, {
        type: 'x',
        trigger: scene,
        allowNativeTouchScrolling: true,
        dragClickables: true,
        minimumMovement: 4,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress() {
          stopAutoplay();
          snapTween?.kill();
          rotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
          pressX = this.x;
          pressRotation = rotation;
        },
        onDrag() {
          rotation = pressRotation + (this.x - pressX) * degreesPerPixel;
          gsap.set(ring, { rotationY: rotation, force3D: true });
          updateCardFocus();
        },
        onRelease() {
          const currentRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
          snapTo(Math.round(currentRotation / angleStep) * angleStep);
          gsap.set(dragProxy, { x: 0, y: 0 });
          this.update();
        },
      })[0];

      const goToPrevious = () => {
        stopAutoplay();
        const currentRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
        snapTo(Math.round(currentRotation / angleStep) * angleStep + angleStep);
      };

      const goToNext = () => {
        stopAutoplay();
        const currentRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
        snapTo(Math.round(currentRotation / angleStep) * angleStep - angleStep);
      };

      previousButton?.addEventListener('click', goToPrevious);
      nextButton?.addEventListener('click', goToNext);
      gsap.set(scene, { touchAction: 'pan-y' });
      positionCards();
      startAutoplay();

      return () => {
        draggable?.kill();
        snapTween?.kill();
        stopAutoplay();
        previousButton?.removeEventListener('click', goToPrevious);
        nextButton?.removeEventListener('click', goToNext);
        dragProxy.remove();
      };
    }, section);

    const loadedImages = Array.from(section.querySelectorAll('img'));
    loadedImages.forEach((image) => {
      if (!image.complete) image.addEventListener('load', scheduleLayout, { once: true });
    });

    const resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(section);
    resizeObserver.observe(scene);
    resizeObserver.observe(cards[0]);
    window.addEventListener('resize', scheduleLayout);
    scheduleLayout();

    return () => {
      cancelAnimationFrame(refreshFrame);
      loadedImages.forEach((image) => image.removeEventListener('load', scheduleLayout));
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleLayout);
      ctx.revert();
      scene.style.removeProperty('--ring-radius');
      cards.forEach((card, index) => {
        card.style.removeProperty('--card-angle');
        card.style.removeProperty('visibility');
        card.style.removeProperty('pointer-events');
        card.removeAttribute('aria-hidden');
        delete card.dataset.ringAngle;
        if (links[index]) links[index].removeAttribute('tabindex');
        ['opacity', 'transform', 'filter'].forEach((property) =>
          surfaces[index]?.style.removeProperty(property),
        );
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[760px] flex-col overflow-hidden bg-[#07073b] py-8 text-white sm:py-10 lg:py-12"
      data-motion-ring-section
    >
      <header className="container-custom shrink-0 pb-6 sm:pb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#C58A2A] backdrop-blur">
              <Fuel className="h-4 w-4" />
              Servicios principales
            </div>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              Soluciones tecnicas para el sector hidrocarburos.
            </MotionTitle>
          </div>

          <Link
            to="/services#servicios-listado"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 lg:self-auto"
          >
            Ver lista completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="relative min-h-0 w-full flex-1 overflow-hidden">
        <button
          type="button"
          data-ring-prev
          aria-label="Servicio anterior"
          title="Servicio anterior"
          className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#07073b]/85 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#238A55] focus:outline-none focus:ring-4 focus:ring-[#A8D8BA]/40 sm:left-5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div ref={sceneRef} className="scene relative h-full min-h-0 w-full" data-motion-ring-scene>
          <div ref={ringRef} className="ring" data-motion-ring>
            {services.map((service, index) => (
              <article
                key={service.name}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="service-card"
                data-ring-card
              >
                <div
                  className="service-card__surface group relative overflow-hidden rounded-lg border border-white/25 bg-[#F4F5F6] shadow-2xl shadow-black/35"
                  data-ring-card-surface
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable="false"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07073b]/70 via-[#07073b]/10 to-[#07073b]/90" />

                  <div className="absolute inset-x-4 top-4 sm:inset-x-5 sm:top-5">
                    <h3 className="max-w-[92%] rounded-lg border border-white/20 bg-[#07073b]/90 px-4 py-3 text-xl font-black leading-tight text-white shadow-lg backdrop-blur-md sm:text-2xl">
                      {service.name}
                    </h3>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                    <div className="rounded-lg border border-white/70 bg-[#F4F5F6]/95 p-4 text-[#07073b] shadow-xl backdrop-blur-md">
                      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#238A55]">
                        <ShieldCheck className="h-4 w-4" />
                        {service.category}
                      </div>
                      <p className="text-sm font-semibold leading-relaxed text-[#303840] sm:text-base">
                        {service.subtitle}
                      </p>
                    </div>

                    <Link
                      to="/services#servicios-listado"
                      state={{ prefill: service.name }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#238A55] px-4 py-3 text-center text-sm font-black text-white shadow-lg transition-colors hover:bg-[#196B43] focus:outline-none focus:ring-4 focus:ring-[#A8D8BA]/40"
                    >
                      Consultar este servicio
                      <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          data-ring-next
          aria-label="Siguiente servicio"
          title="Siguiente servicio"
          className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#07073b]/85 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#238A55] focus:outline-none focus:ring-4 focus:ring-[#A8D8BA]/40 sm:right-5"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default PopularCountriesSection;
