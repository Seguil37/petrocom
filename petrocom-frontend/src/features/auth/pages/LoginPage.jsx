// src/features/auth/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Shield, Star } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Limpiar errores
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    clearError();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      // El error ya está en el store
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(197,138,42,0.16),_transparent_28%),linear-gradient(120deg,#F8F5F1_0%,#F4F5F6_48%,#E8ECF8_100%)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#07073b] via-[#10104d] to-[#C58A2A] rounded-2xl mb-6 shadow-xl">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-[#07073b] mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-[#5F6B76]">
            Inicia sesion para consultar y gestionar tus tramites PETROCOM.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white/82 rounded-2xl shadow-xl p-8 animate-slide-up backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {error && (
              <div className="bg-[#F4F5F6] border-l-4 border-[#C58A2A] p-4 rounded-lg animate-fade-in flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C58A2A] flex-shrink-0 mt-0.5" />
                <p className="text-[#C58A2A] text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C58A2A]" />
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'email' ? 'text-[#07073b]' : 'text-[#5F6B76]'
                }`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.email
                      ? 'border-[#C58A2A] focus:border-[#C58A2A]'
                      : focusedField === 'email'
                      ? 'border-[#07073b] bg-[#F4F5F6]'
                      : 'border-[#D7DCE1] focus:border-[#07073b]'
                  }`}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-[#C58A2A] animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C58A2A]" />
                Contraseña
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'password' ? 'text-[#07073b]' : 'text-[#5F6B76]'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.password
                      ? 'border-[#C58A2A] focus:border-[#C58A2A]'
                      : focusedField === 'password'
                      ? 'border-[#07073b] bg-[#F4F5F6]'
                      : 'border-[#D7DCE1] focus:border-[#07073b]'
                  }`}
                  placeholder="•••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6B76] hover:text-[#07073b] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-[#C58A2A] animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#07073b] via-[#10104d] to-[#238A55] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* Link a registro */}
          <div className="mt-8 text-center">
            <p className="text-[#5F6B76]">
              ¿Aún no tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-[#238A55] hover:text-[#C58A2A] font-bold transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Beneficios */}
        

        {/* Cuentas de prueba */}
        
      </div>
    </div>
  );
};

export default LoginPage;
