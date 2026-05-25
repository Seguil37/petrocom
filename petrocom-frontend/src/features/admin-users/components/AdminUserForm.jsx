// src/features/admin-users/components/AdminUserForm.jsx
import { useEffect, useState } from 'react';
import { Eye, EyeOff, ShieldCheck, UserCog, UserRoundCog, X } from 'lucide-react';
import { ROLES } from '../../../shared/constants/roles';
import { normalizeEmail, toTitleCase } from '../../../shared/utils/formNormalization';

const AdminUserForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors = {},
  isEditing,
  saving,
  canManageMaster = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowPassword(false);
      setShowPasswordConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dfe2ea] bg-[#f3f4f6]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#dfe2ea] text-[#07073b]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#65647a] font-semibold">
                {isEditing ? 'Editar administrador' : 'Nuevo administrador'}
              </p>
              <h3 className="text-xl font-black text-[#07073b]">
                {isEditing ? 'Actualiza datos y permisos' : canManageMaster ? 'Crea un usuario admin o master' : 'Crea un usuario interno'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#65647a] hover:text-[#07073b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-1">Nombre completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleChange('name', toTitleCase(formData.name))}
                className="w-full px-4 py-3 rounded-xl border border-[#dfe2ea] focus:outline-none focus:ring-2 focus:ring-[#1fb74d] bg-[#ffffff]"
                placeholder="Ej: Ana Pérez"
              />
              <p className="mt-1 text-xs text-[#65647a]">Usa nombre y apellidos completos; se corrige a formato titulo.</p>
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleChange('email', normalizeEmail(formData.email))}
                className="w-full px-4 py-3 rounded-xl border border-[#dfe2ea] focus:outline-none focus:ring-2 focus:ring-[#1fb74d] bg-[#ffffff]"
                placeholder="admin@empresa.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#dfe2ea] focus:outline-none focus:ring-2 focus:ring-[#1fb74d] bg-[#ffffff]"
                  placeholder={isEditing ? 'Dejar vacio para mantener' : 'Minimo 8 caracteres'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65647a] hover:text-[#07073b]"
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Ver contrasena'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={(e) => handleChange('password_confirmation', e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#dfe2ea] focus:outline-none focus:ring-2 focus:ring-[#1fb74d] bg-[#ffffff]"
                  placeholder="Repite la contrasena"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65647a] hover:text-[#07073b]"
                  aria-label={showPasswordConfirmation ? 'Ocultar confirmacion de contrasena' : 'Ver confirmacion de contrasena'}
                >
                  {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#07073b]">Rol</p>
              <div className="flex gap-3 flex-wrap">
                <label className={`admin-role-pill ${formData.role === ROLES.ADMIN ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={ROLES.ADMIN}
                    checked={formData.role === ROLES.ADMIN}
                    onChange={() => handleChange('role', ROLES.ADMIN)}
                    className="hidden"
                  />
                  <UserCog className="w-4 h-4" /> Admin
                </label>
                {canManageMaster && (
                  <label className={`admin-role-pill ${formData.role === ROLES.MASTER_ADMIN ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={ROLES.MASTER_ADMIN}
                      checked={formData.role === ROLES.MASTER_ADMIN}
                      onChange={() => handleChange('role', ROLES.MASTER_ADMIN)}
                      className="hidden"
                    />
                    <ShieldCheck className="w-4 h-4" /> Master Admin
                  </label>
                )}
                <label className={`admin-role-pill ${formData.role === ROLES.OPERATOR ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={ROLES.OPERATOR}
                    checked={formData.role === ROLES.OPERATOR}
                    onChange={() => handleChange('role', ROLES.OPERATOR)}
                    className="hidden"
                  />
                  <UserRoundCog className="w-4 h-4" /> Operativo
                </label>
              </div>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>

            <div className="flex items-center justify-between bg-[#ffffff] border border-[#dfe2ea] rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#07073b]">Estado</p>
                <p className="text-xs text-[#65647a]">Activo por defecto</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#dfe2ea] rounded-full peer peer-checked:bg-[#1fb74d] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dfe2ea]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#dfe2ea] text-[#65647a] hover:bg-[#f3f4f6] font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-primary text-white font-bold shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;
