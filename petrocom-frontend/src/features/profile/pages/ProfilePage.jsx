// src/features/booking/pages/ProfilePage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Star,
  AlertCircle,
  Lock,
  KeyRound,
  Settings
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { authApi } from '../../../shared/utils/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    country: user?.country || '',
    city: user?.city || '',
  });
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authApi.updateProfile(formData);
      updateUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      if (apiErrors) {
        const formattedErrors = Object.fromEntries(
          Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])
        );

        setErrors(formattedErrors);
      } else {
        console.error('Error updating profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      country: user?.country || '',
      city: user?.city || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordError) {
      setPasswordError('');
    }
    if (passwordMessage) {
      setPasswordMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Por favor completa todos los campos.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await authApi.updateProfile({
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      });

      updateUser(response.data.user);
      setPasswordMessage('Tu contraseña ha sido actualizada correctamente.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const apiMessage = error.response?.data?.message;

      if (apiErrors?.current_password?.length) {
        setPasswordError(apiErrors.current_password[0]);
      } else if (apiErrors?.password?.length) {
        setPasswordError(apiErrors.password[0]);
      } else if (apiMessage) {
        setPasswordError(apiMessage);
      } else {
        setPasswordError('No se pudo actualizar la contraseña. Inténtalo nuevamente.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#f3f4f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-[#f3f4f6] rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-[#e8a12f]" />
          </div>
          <h2 className="text-2xl font-bold text-[#07073b] mb-2">Debes iniciar sesión</h2>
          <p className="text-[#65647a] mb-6">Por favor, inicia sesión para ver tu perfil</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#f3f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Principal - Perfil y Formulario */}
          <div className="md:col-span-2 space-y-8">
            {/* Header con Avatar y Botón de Editar */}
            <div className="bg-[#f3f4f6] rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in">
              {/* Banner de Perfil */}
              <div className="h-32 bg-[#1fb74d] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1fb74d]/50 to-[#e8a12f]/50"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-[#e8a12f]" />
                    <span className="text-2xl font-bold text-[#e8a12f]">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Editar */}
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-[#f3f4f6]/90 backdrop-blur-sm rounded-full p-2 hover:bg-[#f3f4f6] transition-colors"
              >
                <Edit2 className="w-5 h-5 text-[#07073b]" />
              </button>
            </div>

            {/* Formulario de Edición */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1fb74d]" />
                    Nombre completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all ${
                        errors.name
                          ? 'border-[#e8a12f]'
                          : 'border-[#dfe2ea] focus:border-[#1fb74d]'
                      }`}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-[#e8a12f] flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-[#e8a12f]" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#1fb74d]" />
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all ${
                        errors.email
                          ? 'border-[#e8a12f]'
                          : 'border-[#dfe2ea] focus:border-[#1fb74d]'
                        }`}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-[#e8a12f] flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-[#e8a12f]" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#1fb74d]" />
                    Teléfono
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-[#e8a12f]'
                          : 'border-[#dfe2ea] focus:border-[#1fb74d]'
                      }`}
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-[#e8a12f] flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-[#e8a12f]" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-[#1fb74d]" />
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#1fb74d] focus:outline-none resize-y transition-all"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {/* País y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#07073b] mb-2">
                      País
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all"
                    disabled={loading}
                    >
                      <option value="">Selecciona un país</option>
                      <option value="Perú">Perú</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#07073b] mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all"
                      placeholder="Lima"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border-2 border-[#dfe2ea] text-[#07073b] font-semibold px-6 py-3 rounded-xl hover:bg-[#f3f4f6] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-4 border-[#dfe2ea] border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Vista de Perfil (no edición)
              <div className="space-y-6">
                {/* Información Personal */}
                <div className="bg-[#f3f4f6] rounded-2xl shadow-lg p-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-[#07073b] mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#1fb74d]" />
                    Información Personal
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[#65647a] font-medium w-24">Nombre:</span>
                      <span className="text-[#07073b] font-medium">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#65647a] font-medium w-24">Email:</span>
                      <span className="text-[#07073b] font-medium truncate">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-[#65647a] font-medium w-24">Teléfono:</span>
                        <span className="text-[#07073b] font-medium">{user?.phone}</span>
                      </div>
                    )}
                    {user?.bio && (
                      <div className="mt-4 p-4 bg-[#f3f4f6] rounded-xl">
                        <p className="text-[#07073b]">{user.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Ubicación */}
                  {(user?.city || user?.country) && (
                    <div className="flex items-center gap-3 mt-4 p-4 bg-[#f3f4f6] rounded-xl">
                      <MapPin className="w-5 h-5 text-[#1fb74d]" />
                      <span className="text-[#07073b]">
                        {user?.city}, {user?.country}
                      </span>
                    </div>
                  )}

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-[#f3f4f6] rounded-xl">
                      <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-6 h-6 text-[#e8a12f]" />
                      </div>
                      <p className="text-[#07073b] font-medium">Miembro desde</p>
                      <p className="text-[#07073b] text-sm">
                        {new Date(user?.created_at).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#f3f4f6] rounded-xl">
                      <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-[#07073b]" />
                      </div>
                      <p className="text-[#07073b] font-medium">Verificado</p>
                      <p className="text-[#07073b] text-sm">Email verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha - Estadísticas y Actividad */}
          <div className="space-y-6">
            <div className="bg-[#f3f4f6] rounded-2xl shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#07073b] mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#1fb74d]" />
                Opciones rápidas
              </h3>
              <p className="text-[#07073b] text-sm mb-4">
                Accede rápidamente a la edición de tus datos personales o a la actualización de tu contraseña.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white border-2 border-[#dfe2ea]/40 hover:border-[#1fb74d] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#1fb74d]" />
                    <div className="text-left">
                      <p className="text-[#07073b] font-semibold">Editar información</p>
                      <span className="text-xs text-[#65647a]">Nombre, correo, teléfono y ubicación</span>
                    </div>
                  </div>
                  <Edit2 className="w-4 h-4 text-[#07073b]" />
                </button>

                <a
                  href="#cambiar-contrasena"
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white border-2 border-[#dfe2ea]/40 hover:border-[#1fb74d] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-[#1fb74d]" />
                    <div className="text-left">
                      <p className="text-[#07073b] font-semibold">Cambiar contraseña</p>
                      <span className="text-xs text-[#65647a]">Refuerza la seguridad de tu cuenta</span>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-[#07073b]" />
                </a>
              </div>
            </div>

            <div id="cambiar-contrasena" className="bg-[#f3f4f6] rounded-2xl shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#07073b] mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#1fb74d]" />
                Cambiar contraseña
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#1fb74d] focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-[#e8a12f] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </p>
                )}

                {passwordMessage && (
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {passwordMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-[#dfe2ea] border-t-transparent rounded-full animate-spin"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar nueva contraseña
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
