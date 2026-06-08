// src/features/admin-users/pages/AdminUsersPage.jsx
import { useEffect, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crown,
  KeyRound,
  Plus,
  RotateCcw,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCog,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { adminUsersApi, extractArray, extractPagination, modulePermissionsApi } from '../../../shared/utils/api';
import { MODULES, ROLES, moduleLabels, roleLabels } from '../../../shared/constants/roles';
import useAuthStore from '../../../store/authStore';
import AdminUserForm from '../components/AdminUserForm';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-red-100 text-red-700 border-red-200',
};

const AdminUsersPage = () => {
  const { user: authUser } = useAuthStore();
  const canManageMasterUsers = authUser?.role === ROLES.MASTER_ADMIN;
  const canDeleteUsers = [ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(authUser?.role);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(getInitialForm());
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [permissionModules, setPermissionModules] = useState({});
  const [modulePermissions, setModulePermissions] = useState({ admin: {}, operator: {} });
  const [modulePermissionDrafts, setModulePermissionDrafts] = useState({ admin: {}, operator: {} });
  const [initialModuleDefaults, setInitialModuleDefaults] = useState({ admin: {}, operator: {} });
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionSaving, setPermissionSaving] = useState('');
  const [selectedPermissionUser, setSelectedPermissionUser] = useState(null);
  const [userPermissionSaving, setUserPermissionSaving] = useState('');

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (authUser?.role === ROLES.MASTER_ADMIN) {
      fetchModulePermissions();
    }
  }, [authUser?.role]);

  function getInitialForm() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: ROLES.ADMIN,
      is_active: true,
    };
  }

  const fetchUsers = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await adminUsersApi.list(page, searchTerm);
      const data = response.data;
      const items = extractArray(data, ['users']);
      const pagination = extractPagination(data, page);
      setUsers(items);
      setMeta({
        current_page: pagination.currentPage,
        last_page: pagination.lastPage,
        total: pagination.total,
        from: pagination.from,
        to: pagination.to,
        per_page: pagination.perPage,
      });
    } catch (err) {
      console.error('Error fetching users', err);
      setError('No se pudieron cargar los administradores.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchModulePermissions = async () => {
    try {
      setPermissionsLoading(true);
      const { data } = await modulePermissionsApi.list();
      setPermissionModules(data.modules || {});
      setModulePermissions(data.roles || { admin: {}, operator: {} });
      setModulePermissionDrafts(data.roles || { admin: {}, operator: {} });
      setInitialModuleDefaults(data.defaults || { admin: {}, operator: {} });
    } catch (err) {
      console.error('Error fetching module permissions', err);
      setError('No se pudieron cargar los permisos por modulo.');
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handleToggleModulePermission = (role, moduleKey) => {
    setModulePermissionDrafts((prev) => ({
      ...prev,
      [role]: {
        ...(prev[role] || {}),
        [moduleKey]: !prev[role]?.[moduleKey],
      },
    }));
  };

  const openUserPermissions = (user) => {
    setSelectedPermissionUser(user);
  };

  const handleToggleUserPermission = async (targetUser, moduleKey) => {
    const nextPermissions = {
      ...(targetUser.module_permissions || {}),
      [moduleKey]: !targetUser.module_permissions?.[moduleKey],
    };

    try {
      setUserPermissionSaving(`${targetUser.id}:${moduleKey}`);
      const { data } = await modulePermissionsApi.updateUser(targetUser.id, nextPermissions);
      const updatedUser = {
        ...targetUser,
        module_permissions: data.permissions || nextPermissions,
      };

      updateUserInState(targetUser.id, updatedUser);
      setSelectedPermissionUser((current) => (current?.id === targetUser.id ? updatedUser : current));
    } catch (err) {
      alert(err.response?.data?.errors?.user?.[0] || err.response?.data?.message || 'No se pudo actualizar el permiso del usuario.');
    } finally {
      setUserPermissionSaving('');
    }
  };

  const openCreateModal = () => {
    setFormData(getInitialForm());
    setFormErrors({});
    setIsEditing(false);
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    if (!canManageMasterUsers && user.role === ROLES.MASTER_ADMIN) {
      alert('Solo el Master puede editar usuarios Master.');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      password_confirmation: '',
      role: user.role || ROLES.ADMIN,
      is_active: Boolean(user.is_active),
    });
    setFormErrors({});
    setIsEditing(true);
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    }

    if (!isEditing || formData.password) {
      if (!formData.password) {
        errors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 8) {
        errors.password = 'Mínimo 8 caracteres';
      }

      if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = 'Las contraseñas no coinciden';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (isEditing && !editingUserId) {
      setError('No se encontró el usuario a editar.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing && formData.password_confirmation) {
        payload.password_confirmation = formData.password_confirmation;
      }

      if (isEditing) {
        await adminUsersApi.update(editingUserId, payload);
      } else {
        await adminUsersApi.create(payload);
      }

      setIsModalOpen(false);
      setError('');
      setFormData(getInitialForm());
      fetchUsers(currentPage, debouncedSearch);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        setFormErrors(Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, v[0]])));
      }
      setError(err.response?.data?.message || 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user) => {
    if (!canManageMasterUsers && user.role === ROLES.MASTER_ADMIN) {
      alert('Solo el Master puede administrar usuarios Master.');
      return;
    }

    if (authUser?.id === user.id && user.is_active) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }

    if (!window.confirm(`¿Seguro que deseas ${user.is_active ? 'desactivar' : 'activar'} a ${user.name}?`)) {
      return;
    }

    try {
      const response = await adminUsersApi.update(user.id, { is_active: !user.is_active });
      updateUserInState(user.id, response.data.user || response.data);
    } catch (err) {
      alert(err.response?.data?.errors?.is_active?.[0] || 'No se pudo actualizar el estado.');
    }
  };

  const handleToggleRole = async (user) => {
    if (!canManageMasterUsers) {
      alert('Solo el Master puede cambiar usuarios a Master.');
      return;
    }

    const nextRole = user.role === ROLES.MASTER_ADMIN ? ROLES.ADMIN : ROLES.MASTER_ADMIN;

    if (authUser?.id === user.id && nextRole !== ROLES.MASTER_ADMIN) {
      alert('No puedes degradar tu propio rol de master admin.');
      return;
    }

    if (!window.confirm(`¿Confirmas cambiar el rol de ${user.name} a ${roleLabels[nextRole]}?`)) {
      return;
    }

    try {
      const response = await adminUsersApi.update(user.id, { role: nextRole });
      updateUserInState(user.id, response.data.user || response.data);
    } catch (err) {
      alert(err.response?.data?.errors?.role?.[0] || 'No se pudo actualizar el rol.');
    }
  };

  const handleDelete = async (user) => {
    if (!canDeleteUsers) {
      alert('Los operativos no pueden eliminar usuarios.');
      return;
    }

    if (!canManageMasterUsers && user.role === ROLES.MASTER_ADMIN) {
      alert('Solo el Master puede eliminar usuarios Master.');
      return;
    }

    if (!window.confirm(`¿Seguro que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await adminUsersApi.delete(user.id);

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setMeta((prev) => ({
          ...prev,
          total: Math.max(0, (prev.total || 1) - 1),
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.errors?.user?.[0] || 'No se pudo eliminar el usuario.');
    }
  };

  const updateUserInState = (userId, updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updatedUser } : u)));
  };

  const renderStatusBadge = (isActive) => {
    const style = isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${style}`}>
        {isActive ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const moduleOrder = [
    MODULES.TRAMITES_MANAGE,
    MODULES.TRAMITE_TYPES,
    MODULES.TRAMITES_CONTROL,
    MODULES.TASKS_SUMMARY,
    MODULES.PROJECTS,
    MODULES.SERVICES,
    MODULES.ADMIN_USERS,
  ];
  const editablePermissionRoles = [ROLES.ADMIN, ROLES.OPERATOR];
  const permissionChanges = editablePermissionRoles.flatMap((role) =>
    moduleOrder
      .filter((moduleKey) => Boolean(modulePermissions[role]?.[moduleKey]) !== Boolean(modulePermissionDrafts[role]?.[moduleKey]))
      .map((moduleKey) => ({
        role,
        roleName: roleLabels[role] || role,
        moduleKey,
        moduleName: permissionModules[moduleKey]?.label || moduleLabels[moduleKey] || moduleKey,
        enabled: Boolean(modulePermissionDrafts[role]?.[moduleKey]),
      }))
  );
  const hasPermissionChanges = permissionChanges.length > 0;
  const hasInitialDefaults = editablePermissionRoles.some((role) => Object.keys(initialModuleDefaults[role] || {}).length > 0);
  const isUsingInitialDefaults = hasInitialDefaults && editablePermissionRoles.every((role) =>
    moduleOrder.every((moduleKey) => (
      Boolean(modulePermissionDrafts[role]?.[moduleKey]) === Boolean(initialModuleDefaults[role]?.[moduleKey])
    ))
  );

  const handleDiscardDefaultPermissionChanges = () => {
    setModulePermissionDrafts(modulePermissions);
  };

  const handleSaveDefaultPermissions = async () => {
    if (!hasPermissionChanges) {
      return;
    }

    const summary = permissionChanges
      .map((change) => `- ${change.roleName}: ${change.moduleName} -> ${change.enabled ? 'Permitido' : 'Bloqueado'}`)
      .join('\n');
    const confirmed = window.confirm(
      `Estas editando permisos predeterminados.\n\nCambios por guardar:\n${summary}\n\n` +
        'Estos cambios solo aplicaran como plantilla para nuevos usuarios. ¿Confirmas guardar?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setPermissionSaving('defaults');
      const changedRoles = [...new Set(permissionChanges.map((change) => change.role))];
      const updatedRoles = {};

      for (const role of changedRoles) {
        const { data } = await modulePermissionsApi.update(role, modulePermissionDrafts[role] || {});
        updatedRoles[role] = data.permissions || modulePermissionDrafts[role] || {};
      }

      setModulePermissions((prev) => ({
        ...prev,
        ...updatedRoles,
      }));
      setModulePermissionDrafts((prev) => ({
        ...prev,
        ...updatedRoles,
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudieron guardar los permisos predeterminados.');
    } finally {
      setPermissionSaving('');
    }
  };

  const handleApplyInitialDefaultPermissions = async () => {
    if (!hasInitialDefaults) {
      alert('No se encontro la configuracion inicial de permisos.');
      return;
    }

    if (isUsingInitialDefaults) {
      return;
    }

    setModulePermissionDrafts((prev) => ({
      ...prev,
      admin: { ...(initialModuleDefaults.admin || {}) },
      operator: { ...(initialModuleDefaults.operator || {}) },
    }));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.2em] text-[#5F6B76] font-semibold">Panel de administración</p>
            <h1 className="text-3xl font-black text-[#07073b] mt-2">Gestión de Administradores</h1>
            <p className="text-[#5F6B76] mt-2 max-w-3xl">
              Crea, edita y controla el acceso de usuarios internos segun los permisos asignados por el Master.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap xl:justify-end">
            <AdminPanelBackButton />
            <button
              onClick={openCreateModal}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-primary px-4 py-2 text-sm font-bold leading-none text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Crear Admin
            </button>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl shadow-lg border border-[#D7DCE1]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 border-b border-[#D7DCE1]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#D7DCE1] text-[#07073b]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#07073b]">Usuarios Admin</h2>
                <p className="text-[#5F6B76]">Nombre, correo, rol y estado de acceso</p>
              </div>
            </div>
            <div className="text-sm text-[#5F6B76] font-semibold">
              Total: <span className="text-[#07073b] font-black">{meta.total}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 border-b border-[#D7DCE1] md:flex-row md:items-center md:justify-between">
            <label className="relative block w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5F6B76]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, correo o rol"
                className="w-full rounded-lg border border-[#D7DCE1] bg-white py-3 pl-12 pr-4 text-[#07073b] outline-none transition-colors placeholder:text-[#5F6B76] focus:border-[#07073b]"
              />
            </label>
            <p className="text-sm text-[#5F6B76]">
              {debouncedSearch ? `Resultados para "${debouncedSearch}"` : 'Lista de usuarios administrativos'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 px-5 py-3 border-b border-[#D7DCE1] text-xs font-semibold text-[#5F6B76]">
            <span className="inline-flex items-center gap-1">
              <UserCog className="h-4 w-4 text-[#07073b]" /> Editar
            </span>
            <span className="inline-flex items-center gap-1">
              <UserMinus className="h-4 w-4 text-red-700" /> Desactivar
            </span>
            {canManageMasterUsers && (
              <>
                <span className="inline-flex items-center gap-1">
                  <Crown className="h-4 w-4 text-[#7A5A22]" /> Hacer/Quitar Master
                </span>
                <span className="inline-flex items-center gap-1">
                  <KeyRound className="h-4 w-4 text-[#07073b]" /> Permisos
                </span>
              </>
            )}
            <span className="inline-flex items-center gap-1">
              <Trash2 className="h-4 w-4 text-red-700" /> Eliminar
            </span>
          </div>

          {error && <p className="text-red-600 px-6 pt-4">{error}</p>}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-[#5F6B76]">No hay administradores registrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] table-fixed text-left">
                <thead className="bg-[#F4F5F6] text-[#5F6B76] uppercase text-xs tracking-[0.1em]">
                  <tr>
                    <th className="w-[16%] py-4 px-4 font-semibold">Nombre</th>
                    <th className="w-[20%] py-4 px-4 font-semibold">Email</th>
                    <th className="w-[14%] py-4 px-4 font-semibold">Rol</th>
                    <th className="w-[12%] py-4 px-4 font-semibold">Estado</th>
                    <th className="w-[10%] py-4 px-4 font-semibold">Creado</th>
                    <th className="w-[28%] py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F5F6]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#ffffff]">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#07073b]">{u.name}</span>
                          <span className="text-xs text-[#5F6B76]">ID: {u.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#07073b] break-all">{u.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${
                            u.role === ROLES.MASTER_ADMIN
                              ? 'bg-[#E9F3EE] text-[#07073b] border-[#DDEFE5]'
                              : 'bg-[#E9F3EE] text-[#7A5A22] border-[#F3EFE6]'
                          }`}
                        >
                          {u.role === ROLES.MASTER_ADMIN ? <Shield className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">{renderStatusBadge(u.is_active)}</td>
                      <td className="py-4 px-4 text-[#5F6B76]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            title="Editar"
                            aria-label={`Editar ${u.name}`}
                            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#D7DCE1] text-[#07073b] hover:bg-[#F4F5F6]"
                          >
                            <UserCog className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(u)}
                            title={u.is_active ? 'Desactivar' : 'Activar'}
                            aria-label={`${u.is_active ? 'Desactivar' : 'Activar'} ${u.name}`}
                            className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${
                              u.is_active
                                ? 'border-red-200 text-red-700 hover:bg-red-50'
                                : 'border-green-200 text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {u.is_active ? <UserMinus className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                          </button>
	                          {canManageMasterUsers && (
	                            <button
	                              onClick={() => handleToggleRole(u)}
	                              title={u.role === ROLES.MASTER_ADMIN ? 'Quitar Master' : 'Hacer Master'}
	                              aria-label={`${u.role === ROLES.MASTER_ADMIN ? 'Quitar Master' : 'Hacer Master'} a ${u.name}`}
	                              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#F3EFE6] text-[#7A5A22] hover:bg-[#E9F3EE]"
	                            >
	                              <Crown className="h-5 w-5" />
	                            </button>
	                          )}
	                          {canManageMasterUsers && u.role !== ROLES.MASTER_ADMIN && (
                            <button
                              onClick={() => openUserPermissions(u)}
                              title="Permisos"
                              aria-label={`Editar permisos de ${u.name}`}
                              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#D7DCE1] text-[#07073b] hover:bg-[#F4F5F6]"
                            >
                              <KeyRound className="h-5 w-5" />
                            </button>
                          )}
	                          {canDeleteUsers && authUser?.id !== u.id && (canManageMasterUsers || u.role !== ROLES.MASTER_ADMIN) && (
                            <button
                              onClick={() => handleDelete(u)}
                              title="Eliminar"
                              aria-label={`Eliminar ${u.name}`}
                              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && users.length > 0 && (
            <Pagination meta={meta} onPageChange={setCurrentPage} />
          )}
        </div>

        {authUser?.role === ROLES.MASTER_ADMIN && (
          <section className="space-y-4">
            <div className="flex justify-center sm:justify-end">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Crear Admin
              </button>
            </div>

            <div className="rounded-2xl border border-[#D7DCE1] bg-white/80 p-5 shadow-lg">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#238A55] font-semibold">Plantillas por rol</p>
                <h2 className="mt-2 text-2xl font-black text-[#07073b]">Permisos predeterminados</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5F6B76]">
                  Estos permisos se copian cuando creas un nuevo Administrador u Operativo. Los usuarios ya creados se ajustan desde su fila individual.
                </p>
              </div>
              {permissionsLoading && <span className="text-sm font-semibold text-[#5F6B76]">Cargando permisos...</span>}
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-[#D7DCE1] text-xs uppercase tracking-[0.16em] text-[#5F6B76]">
                      <th className="py-3 pr-4 font-bold">Modulo</th>
                      {editablePermissionRoles.map((role) => (
                        <th key={role} className="py-3 px-4 font-bold text-center">{roleLabels[role]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F5F6]">
                    {moduleOrder.map((moduleKey) => {
                      const moduleMeta = permissionModules[moduleKey] || {};

                      return (
                        <tr key={moduleKey}>
                          <td className="py-4 pr-4">
                            <p className="font-bold text-[#07073b]">{moduleMeta.label || moduleLabels[moduleKey]}</p>
                            <p className="text-xs uppercase tracking-[0.16em] text-[#5F6B76]">
                              {moduleMeta.group === 'announcements' ? 'Anuncios' : 'Operacion interna'}
                            </p>
                          </td>
                          {editablePermissionRoles.map((role) => {
                            const checked = Boolean(modulePermissionDrafts[role]?.[moduleKey]);
                            const changed = Boolean(modulePermissions[role]?.[moduleKey]) !== checked;

                            return (
                              <td key={`${role}-${moduleKey}`} className="py-4 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleModulePermission(role, moduleKey)}
                                  disabled={Boolean(permissionSaving)}
                                  className={`inline-flex min-w-[112px] items-center justify-center rounded-full border px-3 py-2 text-sm font-bold transition-colors ${
                                    checked
                                      ? 'border-green-200 bg-green-100 text-green-700 hover:bg-green-50'
                                      : 'border-[#D7DCE1] bg-[#F4F5F6] text-[#5F6B76] hover:bg-white'
                                  } ${changed ? 'ring-2 ring-[#238A55]/35' : ''} disabled:opacity-60`}
                                >
                                  {checked ? 'Permitido' : 'Bloqueado'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] p-4">
                {hasPermissionChanges ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-[#07073b]">Estas editando permisos predeterminados</p>
                      <p className="text-sm text-[#5F6B76]">
                        Tienes {permissionChanges.length} cambio{permissionChanges.length === 1 ? '' : 's'} sin guardar.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {permissionChanges.map((change) => (
                        <span
                          key={`${change.role}-${change.moduleKey}`}
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            change.enabled
                              ? 'border-green-200 bg-green-100 text-green-700'
                              : 'border-red-200 bg-red-50 text-red-700'
                          }`}
                        >
                          {change.roleName}: {change.moduleName} {'->'} {change.enabled ? 'Permitido' : 'Bloqueado'}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#5F6B76]">No hay cambios pendientes en los permisos predeterminados.</p>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleApplyInitialDefaultPermissions}
                      disabled={permissionsLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#F3EFE6] bg-[#E9F3EE] px-4 py-2 text-sm font-bold text-[#7A5A22] hover:bg-[#F3EFE6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Usar configuracion predeterminada
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscardDefaultPermissionChanges}
                      disabled={!hasPermissionChanges || Boolean(permissionSaving)}
                      className="rounded-lg border border-[#D7DCE1] px-4 py-2 text-sm font-bold text-white hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Descartar cambios
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDefaultPermissions}
                      disabled={!hasPermissionChanges || Boolean(permissionSaving)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#07073b] px-4 py-2 text-sm font-bold text-white hover:bg-[#07073b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {permissionSaving === 'defaults' ? 'Guardando...' : 'Guardar permisos'}
                    </button>
                  </div>
                  {isUsingInitialDefaults && (
                    <p className="text-sm text-[#5F6B76] sm:text-right">
                      Ya estas usando la configuracion predeterminada.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <AdminUserForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={formErrors}
        isEditing={isEditing}
        saving={saving}
        canManageMaster={canManageMasterUsers}
      />

      {selectedPermissionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-3 border-b border-[#D7DCE1] p-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#238A55] font-semibold">Permisos individuales</p>
                <h3 className="mt-2 text-2xl font-black text-[#07073b]">{selectedPermissionUser.name}</h3>
                <p className="mt-1 text-sm text-[#5F6B76]">
                  Estos permisos solo aplican a este usuario. El Master mantiene acceso total.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPermissionUser(null)}
                className="rounded-lg border border-[#D7DCE1] px-4 py-2 text-sm font-bold text-white hover:bg-[#F4F5F6]"
              >
                Cerrar
              </button>
            </div>

            <div className="divide-y divide-[#F4F5F6] p-2">
              {moduleOrder.map((moduleKey) => {
                const moduleMeta = permissionModules[moduleKey] || {};
                const checked = Boolean(selectedPermissionUser.module_permissions?.[moduleKey]);
                const savingKey = `${selectedPermissionUser.id}:${moduleKey}`;

                return (
                  <div key={moduleKey} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold text-[#07073b]">{moduleMeta.label || moduleLabels[moduleKey]}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#5F6B76]">
                        {moduleMeta.group === 'announcements' ? 'Anuncios' : 'Operacion interna'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleUserPermission(selectedPermissionUser, moduleKey)}
                      disabled={userPermissionSaving === savingKey}
                      className={`inline-flex min-w-[120px] items-center justify-center rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                        checked
                          ? 'border-green-200 bg-green-100 text-green-700 hover:bg-green-50'
                          : 'border-[#D7DCE1] bg-[#F4F5F6] text-[#5F6B76] hover:bg-white'
                      } disabled:opacity-60`}
                    >
                      {userPermissionSaving === savingKey ? 'Guardando...' : checked ? 'Permitido' : 'Bloqueado'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ meta, onPageChange }) => {
  const currentPage = Number(meta.current_page || 1);
  const lastPage = Number(meta.last_page || 1);
  const pages = Array.from({ length: lastPage }, (_, index) => index + 1).filter((page) => (
    page === 1 || page === lastPage || Math.abs(page - currentPage) <= 1
  ));

  return (
    <div className="flex flex-col gap-3 border-t border-[#D7DCE1] p-5 text-sm text-[#5F6B76] md:flex-row md:items-center md:justify-between">
      <div>
        Mostrando <span className="font-bold text-[#07073b]">{meta.from || 0}</span>
        {' - '}
        <span className="font-bold text-[#07073b]">{meta.to || 0}</span>
        {' de '}
        <span className="font-bold text-[#07073b]">{meta.total || 0}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D7DCE1] hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page, index) => {
          const previous = pages[index - 1];
          const showGap = previous && page - previous > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showGap && <span className="text-[#5F6B76]">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-9 min-w-[36px] rounded-lg px-3 text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-gradient-primary text-white'
                    : 'border border-[#D7DCE1] text-[#5F6B76] hover:bg-[#F4F5F6]'
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
          disabled={currentPage === lastPage}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D7DCE1] hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminUsersPage;
