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
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#1fb74d] rounded-2xl mb-6 shadow-xl">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-[#07073b] mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-[#65647a]">
            Inicia sesión para dejar reseñas, tu opinion nos importa.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-[#f3f4f6] rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {error && (
              <div className="bg-[#f3f4f6] border-l-4 border-[#e8a12f] p-4 rounded-lg animate-fade-in flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#e8a12f] flex-shrink-0 mt-0.5" />
                <p className="text-[#e8a12f] text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1fb74d]" />
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'email' ? 'text-[#1fb74d]' : 'text-[#65647a]'
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
                      ? 'border-[#e8a12f] focus:border-[#e8a12f]'
                      : focusedField === 'email'
                      ? 'border-[#1fb74d] bg-[#f3f4f6]'
                      : 'border-[#dfe2ea] focus:border-[#1fb74d]'
                  }`}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-[#e8a12f] animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1fb74d]" />
                Contraseña
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'password' ? 'text-[#1fb74d]' : 'text-[#65647a]'
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
                      ? 'border-[#e8a12f] focus:border-[#e8a12f]'
                      : focusedField === 'password'
                      ? 'border-[#1fb74d] bg-[#f3f4f6]'
                      : 'border-[#dfe2ea] focus:border-[#1fb74d]'
                  }`}
                  placeholder="•••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#65647a] hover:text-[#1fb74d] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-[#e8a12f] animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-[#65647a]">
              ¿Aún no tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-[#1fb74d] hover:text-[#e8a12f] font-bold transition-colors"
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
