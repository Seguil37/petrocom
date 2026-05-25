export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  ADMIN: 'admin',
  OPERATOR: 'operator',
  CLIENT: 'client',
};

export const roleLabels = {
  [ROLES.MASTER_ADMIN]: 'Master',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.OPERATOR]: 'Operativo',
  [ROLES.CLIENT]: 'Cliente',
};

export const isAdminRole = (role) => [ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(role);

export const isStaff = (role) => [ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR].includes(role);

export const MODULES = {
  PROJECTS: 'projects',
  SERVICES: 'services',
  TRAMITES_MANAGE: 'tramites_manage',
  TRAMITE_TYPES: 'tramite_types',
  TRAMITES_CONTROL: 'tramites_control',
  TASKS_SUMMARY: 'tasks_summary',
  ADMIN_USERS: 'admin_users',
};

export const moduleLabels = {
  [MODULES.PROJECTS]: 'Gestion de proyectos publicados',
  [MODULES.SERVICES]: 'Gestion de servicios',
  [MODULES.TRAMITES_MANAGE]: 'Gestion de tramites',
  [MODULES.TRAMITE_TYPES]: 'Tipos de tramite',
  [MODULES.TRAMITES_CONTROL]: 'Vista general tramites',
  [MODULES.TASKS_SUMMARY]: 'Resumen de tareas',
  [MODULES.ADMIN_USERS]: 'Gestion de administradores',
};

export const canAccessModule = (user, moduleKey) => {
  if (!user || !user.is_active) return false;
  if (user.role === ROLES.MASTER_ADMIN) return true;
  return Boolean(user.module_permissions?.[moduleKey]);
};
