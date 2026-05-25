// src/shared/components/Layout/Header.jsx

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Menu,
  X,
  Mail,
  Bell,
  Phone,
  LogOut,
  ClipboardList,
  BriefcaseBusiness,
  FolderKanban,
  Info,
  Heart,
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { notificationsApi } from '../../utils/api';
import petrocomLogo from '../../../assets/images/petrocom-logo.png';
import { ROLES, roleLabels, canAccessModule, MODULES } from '../../constants/roles';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const canAccessAnyInternalModule = [
    MODULES.PROJECTS,
    MODULES.SERVICES,
    MODULES.TRAMITES_MANAGE,
    MODULES.TRAMITE_TYPES,
    MODULES.TRAMITES_CONTROL,
    MODULES.TASKS_SUMMARY,
    MODULES.ADMIN_USERS,
  ].some((moduleKey) => canAccessModule(user, moduleKey));
  const notificationsPath = canAccessAnyInternalModule ? '/admin/notifications' : '/notificaciones';

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setNotificationOpen(false);
      return;
    }

    let active = true;

    const loadNotifications = async () => {
      try {
        const { data } = await notificationsApi.list();
        if (!active) return;
        setNotifications(data.items || []);
        setUnreadCount(data.unread_count || 0);
      } catch (error) {
        console.error('No se pudieron cargar las notificaciones', error);
      }
    };

    loadNotifications();
    const intervalId = setInterval(loadNotifications, 60000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!notificationOpen) return;

    const handlePointerDown = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [notificationOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        pathname: '/projects',
        search: `?search=${encodeURIComponent(searchQuery)}`,
        hash: '#projects-results',
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await notificationsApi.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('No se pudo marcar la notificación como leída', error);
    } finally {
      setNotificationOpen(false);
      navigate(notification.data?.url || notificationsPath);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('No se pudieron marcar las notificaciones', error);
    }
  };

  return (
    <header className="bg-[#f3f4f6] shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo y Buscador */}
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <Link to="/" className="flex items-center">
              <div className="h-12 md:h-14 lg:h-16 max-w-[180px] flex items-center">
                <img
                  src={petrocomLogo}
                  alt="Petrocom"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
            </Link>
            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="hidden lg:flex w-full max-w-md xl:max-w-lg flex-shrink">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="¿Que proyecto buscas?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-3 rounded-full border-2 border-[#dfe2ea] focus:border-[#1fb74d] focus:outline-none transition-all bg-[#f3f4f6] text-[#07073b] placeholder-[#65647a]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#65647a] w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4 ml-4">
            {/* Navegación Principal - Desktop */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
              <Link
                to="/services"
                className="text-[#07073b] hover:text-[#1fb74d] transition-colors"
              >
                Nuestros Servicios
              </Link>
              <Link
                to="/consulta-tramite"
                className="text-[#07073b] hover:text-[#1fb74d] transition-colors"
              >
                Consulta tramite
              </Link>
              <Link
                to="/projects"
                className="text-[#07073b] hover:text-[#1fb74d] transition-colors"
              >
                Nuestros Proyectos
              </Link>
              <Link
                to="/about"
                className="text-[#07073b] hover:text-[#1fb74d] transition-colors"
              >
                Nosotros
              </Link>
            </nav>

            {/* Contacto */}
            <div className="hidden xl:flex items-center gap-4 text-sm">
              <Link
                to="/contacto"
                className="flex items-center gap-1 text-[#07073b] hover:text-[#1fb74d] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contactanos</span>
              </Link>
            </div>

	            {/* Usuario */}
	            {isAuthenticated ? (
	              <div className="flex items-center gap-2">
	                <div className="relative group" ref={notificationRef}>
		                  <button
		                    type="button"
		                    onClick={() => {
		                      setNotificationOpen((prev) => {
	                        const nextOpen = !prev;
	                        if (nextOpen) setMobileMenuOpen(false);
	                        return nextOpen;
	                      });
	                    }}
		                    aria-expanded={notificationOpen}
		                    aria-label="Notificaciones"
		                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
		                      notificationOpen ? 'bg-white text-[#1fb74d]' : 'hover:bg-white'
		                    }`}
		                  >
	                    <Bell className="w-5 h-5 text-[#07073b]" />
	                    {unreadCount > 0 && (
	                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#1fb74d] text-white text-[11px] font-bold flex items-center justify-center">
	                        {unreadCount > 9 ? '9+' : unreadCount}
	                      </span>
	                    )}
		                  </button>

			                  <div
			                    className={`fixed left-4 right-4 top-24 z-[80] max-h-[70vh] overflow-hidden rounded-xl border border-[#dfe2ea] bg-[#f3f4f6] shadow-xl transition-all duration-200 lg:absolute lg:left-auto lg:right-0 lg:top-auto lg:mt-0 lg:w-[380px] lg:max-w-[90vw] ${
			                      notificationOpen
			                        ? 'pointer-events-auto opacity-100 visible translate-y-0'
			                        : 'pointer-events-none opacity-0 invisible -translate-y-1 lg:translate-y-0 lg:group-hover:pointer-events-auto lg:group-hover:visible lg:group-hover:opacity-100'
			                    }`}
			                  >
	                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#dfe2ea]">
	                        <div>
	                          <p className="text-sm font-bold text-[#07073b]">Notificaciones</p>
	                          <p className="text-xs text-[#65647a]">Tareas pendientes y asignaciones</p>
	                        </div>
		                        {unreadCount > 0 && (
		                          <button
		                            type="button"
		                            onClick={handleMarkAllNotificationsRead}
	                            className="text-xs font-semibold text-[#1fb74d] hover:underline"
	                          >
		                            Marcar todas
		                          </button>
		                        )}
		                      </div>
		                      <Link
		                        to={notificationsPath}
		                        onClick={() => setNotificationOpen(false)}
		                        className="block border-b border-[#dfe2ea] px-4 py-2 text-xs font-bold text-[#07073b] transition hover:bg-white"
		                      >
		                        Ver todas y configurar preferencias
		                      </Link>
		                      <div className="max-h-[420px] overflow-y-auto">
	                        {notifications.length === 0 ? (
	                          <div className="px-4 py-6 text-sm text-[#65647a]">No tienes notificaciones por ahora.</div>
	                        ) : (
	                          notifications.map((notification) => (
	                            <button
	                              key={notification.id}
	                              type="button"
	                              onClick={() => handleNotificationClick(notification)}
	                              className={`w-full text-left px-4 py-3 border-b border-[#dfe2ea] hover:bg-white transition-colors ${
	                                notification.read_at ? 'bg-[#f3f4f6]' : 'bg-[#eef8f1]'
	                              }`}
	                            >
	                              <div className="flex items-start justify-between gap-3">
	                                <div className="space-y-1">
	                                  <p className="text-sm font-semibold text-[#07073b]">
		                                    {notification.data?.task_title || notification.data?.label || 'Notificacion'}
	                                  </p>
	                                  <p className="text-xs text-[#454546]">
	                                    {notification.data?.message || 'Tienes una tarea pendiente por revisar.'}
	                                  </p>
	                                  <p className="text-[11px] text-[#65647a]">
	                                    {notification.data?.tramite_code || 'Trámite'}
	                                  </p>
	                                </div>
	                                {!notification.read_at && (
	                                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1fb74d] flex-shrink-0" />
	                                )}
	                              </div>
	                            </button>
	                          ))
	                        )}
		                      </div>
		                    </div>
		                </div>

	                <div className="relative group">
	                <button className="flex items-center gap-2 p-2 hover:bg-white rounded-full transition-all">
	                  {user?.avatar ? (
	                    <img
	                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#1fb74d] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#07073b]">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="font-semibold text-[#07073b]">{user?.name?.split(' ')[0]}</span>
                    <span className="text-[11px] text-[#65647a] font-medium uppercase tracking-wide">
                      {roleLabels[user?.role] || 'Usuario'}
                    </span>
                  </div>
	                  </button>

	                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#f3f4f6] rounded-xl shadow-xl border border-[#dfe2ea] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-white text-[#07073b] rounded-t-xl transition-colors"
                  >
                    Mi Perfil
                  </Link>

                  {/* Favoritos - Solo para clientes */}
                  {user?.role === ROLES.CLIENT && (
                    <>
                      <Link
                        to="/cliente/tramites"
                        className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors"
                      >
                        Mis tramites
                      </Link>
                      <Link
                        to="/favorites"
                        className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors"
                      >
                        Favoritos
                      </Link>
                    </>
                  )}

                  {user?.role !== ROLES.CLIENT && (
                    <Link
                      to="/consulta-tramite"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors"
                    >
                      Consulta tramite
                    </Link>
                  )}

                  {canAccessAnyInternalModule && (
                    <Link
                      to="/admin/panel"
                      className="block px-4 py-3 bg-[#07073b] text-white font-semibold transition-colors border-t border-[#07073b] hover:bg-[#05052f]"
                    >
                      Panel administrativo
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Link
                      to={notificationsPath}
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Notificaciones
                    </Link>
                  )}

                  {canAccessModule(user, MODULES.PROJECTS) && (
                    <Link
                      to="/agency/dashboard"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Gestion de proyectos publicados
                    </Link>
                  )}
                  {canAccessModule(user, MODULES.SERVICES) && (
                    <Link
                      to="/agency/services"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Gestión de servicios
                    </Link>
                  )}
                  {canAccessModule(user, MODULES.TRAMITES_MANAGE) && (
                    <Link
                      to="/tramites/gestion"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Gestión de trámites
                    </Link>
                  )}
                  {canAccessModule(user, MODULES.TRAMITE_TYPES) && (
                    <Link
                      to="/tramites/tipos"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Tipos de trámite
                    </Link>
                  )}
                  {canAccessModule(user, MODULES.TRAMITES_CONTROL) && (
                    <Link
                      to="/tramites/control"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Vista general trámites
                    </Link>
                  )}
                  {canAccessModule(user, MODULES.TASKS_SUMMARY) && (
                    <Link
                      to="/tramites/resumen-tareas"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Resumen de tareas
                    </Link>
                  )}
                  {canAccessModule(user, MODULES.ADMIN_USERS) && (
                    <Link
                      to="/admin/users"
                      className="block px-4 py-3 hover:bg-white text-[#07073b] transition-colors border-t"
                    >
                      Gestión de administradores
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-b-xl transition-colors border-t"
                  >
                    Cerrar Sesión
	                  </button>
	                </div>
	                </div>
	              </div>
	            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">Iniciar Sesión</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setNotificationOpen(false);
              }}
              className="lg:hidden p-2 hover:bg-white rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#07073b]" />
              ) : (
                <Menu className="w-6 h-6 text-[#07073b]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="¿Qué proyecto estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#dfe2ea] focus:border-[#1fb74d] focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#65647a] w-5 h-5" />
          </form>
        </div>

        {/* Mobile Menu */}
	      {mobileMenuOpen && (
	        <div className="lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto pb-4 animate-fade-in">
	          <div className="flex flex-col gap-2">
              <Link
                to="/services"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BriefcaseBusiness className="w-4 h-4 text-[#1fb74d]" />
                Nuestros Servicios
              </Link>
              <Link
                to="/consulta-tramite"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClipboardList className="w-4 h-4 text-[#1fb74d]" />
                Consulta tramite
              </Link>
              <Link
                to="/projects"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FolderKanban className="w-4 h-4 text-[#1fb74d]" />
                Nuestros Proyectos
              </Link>
	              <Link
	                to="/about"
	                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
	                onClick={() => setMobileMenuOpen(false)}
	              >
	                <Info className="w-4 h-4 text-[#1fb74d]" />
	                Nosotros
	              </Link>
              <Link
                to="/contacto"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="w-4 h-4 text-[#1fb74d]" />
                Contactanos
              </Link>

              {isAuthenticated && (
                <>
	                  <div className="border-t border-[#dfe2ea] my-2 pt-2">
	                    <Link
	                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
	                    >
	                      <User className="w-4 h-4 text-[#1fb74d]" />
	                      Mi Perfil
	                    </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 rounded-lg transition-colors hover:bg-red-50 font-semibold"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesion
                      </button>

	                    {user?.role === ROLES.CLIENT && (
                      <>
                        <Link
                          to="/cliente/tramites"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ClipboardList className="w-4 h-4 text-[#1fb74d]" />
                          Mis tramites
                        </Link>
                        <Link
                          to="/favorites"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4 text-[#1fb74d]" />
                          Favoritos
                        </Link>
                      </>
                    )}

                    {canAccessAnyInternalModule && (
                      <Link
                        to="/admin/panel"
                        className="flex items-center gap-2 px-4 py-2 bg-[#07073b] text-white rounded-lg transition-colors font-semibold hover:bg-[#05052f]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Panel administrativo
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.PROJECTS) && (
                      <Link
                        to="/agency/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Gestion de proyectos publicados
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.SERVICES) && (
                      <Link
                        to="/agency/services"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Gestión de servicios
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.TRAMITES_MANAGE) && (
                      <Link
                        to="/tramites/gestion"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Gestión de trámites
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.TRAMITE_TYPES) && (
                      <Link
                        to="/tramites/tipos"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tipos de trámite
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.TRAMITES_CONTROL) && (
                      <Link
                        to="/tramites/control"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Vista general trámites
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.TASKS_SUMMARY) && (
                      <Link
                        to="/tramites/resumen-tareas"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Resumen de tareas
                      </Link>
                    )}

                    {canAccessModule(user, MODULES.ADMIN_USERS) && (
                      <Link
                        to="/admin/users"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Gestión de administradores
                      </Link>
                    )}
                  </div>
                </>
              )}

	              <div className="border-t border-[#dfe2ea] my-2 pt-2">
	                <a href="tel:+51990179027" className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors">
	                  <Phone className="w-4 h-4 text-[#1fb74d]" />
                  <span>+51 990 179 027</span>
                </a>
                <Link
                  to="/contacto"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#07073b] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
	                  <Mail className="w-4 h-4 text-[#1fb74d]" />
	                  <span>Contactanos</span>
	                </Link>
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 rounded-lg transition-colors hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  )}
	              </div>
	            </div>
	          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
