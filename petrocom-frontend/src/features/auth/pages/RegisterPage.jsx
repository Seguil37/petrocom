// src/features/auth/pages/RegisterPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { normalizeEmail, normalizePhone, toTitleCase } from '../../../shared/utils/formNormalization';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuthStore();

  const [step, setStep] = useState(1); // 1: formulario, 2: términos
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await registerUser({
      ...formData,
      name: toTitleCase(formData.name),
      email: normalizeEmail(formData.email),
      phone: normalizePhone(formData.phone),
    });

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error });
    }
  };

  if (step === 2) {
    return (
      <TermsAndConditionsStep
        onBack={() => setStep(1)}
        onSubmit={handleSubmit}
        loading={loading}
        apiError={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#238A55] rounded-2xl mb-6 shadow-xl">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 min-h-[120px]">
            <h2 className="text-4xl font-black text-[#07073b] leading-tight text-center">Crea tu cuenta</h2>
            <p className="text-[#5F6B76] text-center max-w-xl">
              Unete a PETROCOM Energy para consultar tus tramites.
            </p>
          </div>
        </div>

        <div className="bg-[#F4F5F6] rounded-2xl shadow-xl p-8 animate-slide-up">
          {errors.general && (
            <div className="bg-[#F4F5F6] border-l-4 border-[#C58A2A] p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C58A2A] flex-shrink-0 mt-0.5" />
              <p className="text-[#C58A2A] text-sm font-medium">{errors.general}</p>
            </div>
          )}
          <form onSubmit={handleNext} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#07073b] flex items-center gap-2">
                <User className="w-5 h-5 text-[#238A55]" />
                Información Personal
              </h3>

              <InputField
                icon={User}
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Juan Pérez"
              />

              <InputField
                icon={Mail}
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="tu@email.com"
              />

              <InputField
                icon={Phone}
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="+51 999 999 999"
              />
            </div>

            {/* Contraseñas */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-bold text-[#07073b] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#238A55]" />
                Seguridad
              </h3>

              <PasswordField
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Mínimo 8 caracteres"
              />

              <PasswordField
                label="Confirmar contraseña"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#238A55] hover:bg-[#196B43] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Continuar
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#5F6B76]">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-[#238A55] hover:text-[#C58A2A] font-bold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para inputs
const InputField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  focusedField,
  setFocusedField,
  placeholder,
  maxLength,
}) => (
  <div className="relative group">
    <label className="block text-sm font-semibold text-[#07073b] mb-2">{label}</label>
    <div
      className={`flex items-center px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white shadow-sm focus-within:border-[#238A55] focus-within:ring-2 focus-within:ring-[#238A55]/20 ${
        error ? 'border-[#C58A2A]' : 'border-[#D7DCE1]'
      }`}
    >
      {Icon && <Icon className={`w-5 h-5 mr-3 ${focusedField === name ? 'text-[#238A55]' : 'text-[#5F6B76]'}`} />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-transparent focus:outline-none text-[#07073b] placeholder:text-[#5F6B76]"
      />
    </div>
    {error && (
      <p className="mt-1 text-sm text-[#C58A2A] animate-fade-in flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente para contraseñas
const PasswordField = ({ label, name, value, onChange, error, show, onToggle, focusedField, setFocusedField, placeholder }) => (
  <div className="relative group">
    <label className="block text-sm font-semibold text-[#07073b] mb-2">{label}</label>
    <div
      className={`relative px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white shadow-sm focus-within:border-[#238A55] focus-within:ring-2 focus-within:ring-[#238A55]/20 ${
        error ? 'border-[#C58A2A]' : 'border-[#D7DCE1]'
      }`}
    >
      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === name ? 'text-[#238A55]' : 'text-[#5F6B76]'}`} />
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none text-[#07073b] placeholder:text-[#5F6B76] pl-12 pr-12"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#5F6B76] hover:text-[#238A55] transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className="mt-1 text-sm text-[#C58A2A] animate-fade-in flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente de términos y condiciones
const TermsAndConditionsStep = ({ onBack, onSubmit, loading, apiError }) => {
  const [accepted, setAccepted] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) {
      setLocalError('Debes aceptar los términos y condiciones');
      return;
    }

    setLocalError(null);
    await onSubmit(e);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#238A55] rounded-2xl mb-6 shadow-xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-[#07073b] mb-2">Términos y Condiciones</h2>
          <p className="text-[#5F6B76]">Revisa y acepta nuestros términos para continuar</p>
        </div>

        <div className="bg-[#F4F5F6] rounded-2xl shadow-xl p-8 animate-slide-up">
          {(localError || apiError) && (
            <div className="bg-[#F4F5F6] border-l-4 border-[#C58A2A] p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C58A2A] flex-shrink-0 mt-0.5" />
              <p className="text-[#C58A2A] text-sm font-medium">{localError || apiError}</p>
            </div>
          )}

          <div className="border border-[#D7DCE1] rounded-xl p-6 max-h-64 overflow-y-auto mb-6">
            <div className="space-y-4 text-sm text-[#5F6B76]">
              <p className="font-semibold text-[#07073b]">1. Aceptación de términos</p>
              <p>Al crear una cuenta en PETROCOM Energy, aceptas nuestros terminos y condiciones.</p>

              <p className="font-semibold text-[#07073b]">2. Uso del servicio</p>
              <p>Debes utilizar nuestros servicios de manera responsable, legal y sin afectar el funcionamiento de la plataforma.</p>

              <p className="font-semibold text-[#07073b]">3. Privacidad</p>
              <p>Tus datos serán protegidos y utilizados únicamente para fines de contacto, cotización y gestión de servicios.</p>

              <p className="font-semibold text-[#07073b]">4. Información proporcionada</p>
              <p>Te comprometes a registrar informacion veraz y actualizada. PETROCOM Energy no se responsabiliza por errores derivados de datos incorrectos.</p>

              <p className="font-semibold text-[#07073b]">5. Alcance de cotizaciones</p>
              <p>Las cotizaciones son referenciales y pueden variar según cambios de requerimientos, condiciones del inmueble y trámites municipales.</p>

              <p className="font-semibold text-[#07073b]">6. Propiedad intelectual</p>
              <p>Los expedientes, planos, memorias, informes y documentos tecnicos elaborados por PETROCOM Energy son propiedad de la empresa, salvo acuerdo escrito.</p>

              <p className="font-semibold text-[#07073b]">7. Cambios y actualizaciones</p>
              <p>PETROCOM Energy puede actualizar estos terminos cuando sea necesario. Las modificaciones se publicaran en la plataforma.</p>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-[#D7DCE1] hover:border-[#238A55] cursor-pointer transition-all mb-6">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-[#238A55] focus:ring-[#238A55] rounded"
            />
            <span className="text-sm text-[#07073b]">
              Acepto los terminos y condiciones, la politica de privacidad y el acuerdo de uso de PETROCOM Energy.
            </span>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="flex-1 border-2 border-[#D7DCE1] text-[#07073b] font-bold py-4 rounded-xl hover:bg-[#F4F5F6] transition-all disabled:opacity-50"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmit}
              disabled={!accepted || loading}
              className="flex-1 bg-[#238A55] hover:bg-[#196B43] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
