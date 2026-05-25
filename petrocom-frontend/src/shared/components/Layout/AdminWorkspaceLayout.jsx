import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BriefcaseBusiness,
  ChevronLeft,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Layers3,
  ListTodo,
  Menu,
  Settings2,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { MODULES, ROLES, canAccessModule, roleLabels } from '../../constants/roles';

const STORAGE_KEY = 'admin-sidebar-collapsed';
const STAFF_ROLES = [ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR];

const navGroups = [
  {
    key: 'operations',
    title: 'Tramites y operacion interna',
    items: [
      {
        label: 'Panel principal',
        to: '/admin/panel',
        roles: STAFF_ROLES,
        icon: LayoutDashboard,
      },
      {
        label: 'Gestion de tramites',
        to: '/tramites/gestion',
        module: MODULES.TRAMITES_MANAGE,
        roles: STAFF_ROLES,
        icon: Settings2,
      },
      {
        label: 'Clientes',
        to: '/admin/clientes',
        module: MODULES.TRAMITES_MANAGE,
        roles: STAFF_ROLES,
        icon: UserRound,
      },
      {
        label: 'Tipos de tramite',
        to: '/tramites/tipos',
        module: MODULES.TRAMITE_TYPES,
        roles: STAFF_ROLES,
        icon: Layers3,
      },
      {
        label: 'Vista general',
        to: '/tramites/control',
        module: MODULES.TRAMITES_CONTROL,
        roles: STAFF_ROLES,
        icon: ClipboardList,
      },
      {
        label: 'Resumen de tareas',
        to: '/tramites/resumen-tareas',
        module: MODULES.TASKS_SUMMARY,
        roles: STAFF_ROLES,
        icon: ListTodo,
      },
      {
        label: 'Administradores',
        to: '/admin/users',
        module: MODULES.ADMIN_USERS,
        roles: STAFF_ROLES,
        icon: Users,
      },
    ],
  },
  {
    key: 'announcements',
    title: 'Anuncios',
    items: [
      {
        label: 'Proyectos',
        to: '/agency/dashboard',
        module: MODULES.PROJECTS,
        roles: STAFF_ROLES,
        icon: FolderKanban,
      },
      {
        label: 'Servicios',
        to: '/agency/services',
        module: MODULES.SERVICES,
        roles: STAFF_ROLES,
        icon: BriefcaseBusiness,
      },
    ],
  },
];

const SidebarItems = ({ groups, collapsed, onNavigate }) => (
  <div className="space-y-5">
    {groups.map((group) => (
      <section key={group.key} className="space-y-2">
        {!collapsed && (
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#65647a]">
            {group.title}
          </p>
        )}
        <div className="space-y-1.5">
          {group.items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl transition ${
                    collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
                  } ${
                    isActive
                      ? 'bg-[#07073b] text-white shadow-[0_14px_34px_rgba(35,50,116,0.24)]'
                      : 'text-[#07073b] hover:bg-[#f3f4f6]'
                  }`
                }
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/12">
                  <Icon className="h-5 w-5" />
                </span>
                {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </section>
    ))}
  </div>
);

const AdminWorkspaceLayout = () => {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setCollapsed(stored === 'true');
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const groups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            if (!item.roles.includes(user?.role)) return false;
            if (!item.module) return true;
            return canAccessModule(user, item.module);
          }),
        }))
        .filter((group) => group.items.length > 0),
    [user]
  );

  const asideWidth = collapsed ? 'lg:w-[104px]' : 'lg:w-[320px]';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(35,50,116,0.12),_transparent_28%),linear-gradient(180deg,#f3f4f6_0%,#f3f4f6_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1720px]">
        <aside className={`hidden shrink-0 border-r border-[#dfe2ea] bg-[#ffffff] px-4 py-6 transition-all duration-300 lg:block ${asideWidth}`}>
          <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col">
            <div className={`mb-4 rounded-[24px] border border-[#dfe2ea] bg-white shadow-sm ${collapsed ? 'p-3' : 'px-4 py-3'}`}>
              <div className={`flex ${collapsed ? 'justify-center' : 'items-center justify-between gap-3'}`}>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#1fb74d]">Backoffice</p>
                    <p className="mt-1 truncate text-sm font-black text-[#07073b]">Navegacion administrativa</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setCollapsed((value) => !value)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#dfe2ea] bg-[#ffffff] text-[#07073b]"
                  aria-label={collapsed ? 'Expandir menu lateral' : 'Minimizar menu lateral'}
                  title={collapsed ? 'Expandir menu lateral' : 'Minimizar menu lateral'}
                >
                  <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            <div className={`mb-5 rounded-[28px] border border-[#dfe2ea] bg-white shadow-sm ${collapsed ? 'p-3' : 'p-4'}`}>
              <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3 px-2'}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#07073b] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                {!collapsed && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#65647a]">Tu acceso</p>
                    <p className="text-sm font-black text-[#07073b]">{roleLabels[user?.role] || 'Staff'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-[28px] border border-[#dfe2ea] bg-white p-3 shadow-sm">
              <SidebarItems groups={groups} collapsed={collapsed} />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b border-[#dfe2ea] bg-[#f3f4f6]/92 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1fb74d]">Backoffice</p>
                <p className="text-lg font-black text-[#07073b]">Administracion</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dfe2ea] bg-white text-[#07073b] shadow-sm"
                aria-label="Abrir menu lateral"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-[#07073b]/40"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menu lateral"
              />
              <div className="relative h-full w-[88%] max-w-[360px] border-r border-[#dfe2ea] bg-[#ffffff] px-4 py-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between rounded-[28px] border border-[#dfe2ea] bg-white p-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1fb74d]">Backoffice</p>
                    <p className="mt-2 text-xl font-black text-[#07073b]">Navegacion interna</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dfe2ea] bg-white text-[#07073b]"
                    aria-label="Cerrar menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="rounded-[28px] border border-[#dfe2ea] bg-white p-3">
                  <SidebarItems groups={groups} onNavigate={() => setMobileOpen(false)} />
                </div>
              </div>
            </div>
          )}

          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkspaceLayout;
