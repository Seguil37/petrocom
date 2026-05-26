// src/shared/components/Layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <a
        href="https://wa.me/51927985691?text=Hola%20PETROCOM%20Energy%2C%20necesito%20asesoria%20para%20un%20tramite%20de%20hidrocarburos."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactanos por WhatsApp"
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#238A55] text-white shadow-[0_14px_30px_rgba(35,138,85,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#196B43]"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M19.11 17.36c-.27-.14-1.58-.78-1.82-.86-.24-.09-.42-.14-.59.14-.18.27-.68.86-.84 1.04-.15.18-.31.2-.58.07-.27-.14-1.15-.42-2.18-1.35-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.56.12-.12.27-.31.41-.46.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.59-1.43-.81-1.96-.21-.51-.43-.44-.59-.45h-.5c-.18 0-.45.07-.68.31-.24.27-.91.89-.91 2.16 0 1.27.93 2.5 1.05 2.66.13.18 1.82 2.78 4.42 3.89.62.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.58-.65 1.81-1.27.22-.63.22-1.16.15-1.27-.06-.11-.24-.18-.51-.31Z" />
          <path d="M16.02 3.2c-7.03 0-12.74 5.66-12.74 12.64 0 2.23.59 4.41 1.72 6.33L3.2 28.8l6.82-1.78a12.86 12.86 0 0 0 6 1.52h.01c7.03 0 12.77-5.67 12.77-12.65 0-3.38-1.32-6.56-3.7-8.94A12.67 12.67 0 0 0 16.02 3.2Zm0 23.2h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.05 1.05 1.08-3.95-.26-.4a10.47 10.47 0 0 1-1.64-5.55c0-5.82 4.82-10.56 10.74-10.56 2.86 0 5.54 1.1 7.57 3.12a10.41 10.41 0 0 1 3.14 7.44c0 5.83-4.83 10.57-10.73 10.57Z" />
        </svg>
      </a>
      <Footer />
    </div>
  );
};

export default MainLayout;
