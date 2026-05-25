// src/features/agency/components/TourBasicInfo.jsx

import { useState, useEffect } from 'react';
import { MapPin, Type, List } from 'lucide-react';
import api from '../../../shared/utils/api';

const TourBasicInfo = ({ formData, updateFormData, errors = {} }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#07073b] mb-6">
        Información Básica del Tour
      </h2>

      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2">
          Título del Tour *
        </label>
        <div className="relative">
          <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B76] w-5 h-5" />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
              errors.title ? 'border-[#C58A2A]' : 'border-[#D7DCE1] focus:border-primary'
            }`}
            placeholder="Ej: Camino Inca Clásico 4 Días"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-[#C58A2A]">{errors.title}</p>
          )}
        </div>
        {errors.title && (
          <p className="mt-1 text-sm text-[#C58A2A]">{errors.title}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2">
          Categoría *
        </label>
        <div className="relative">
          <List className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B76] w-5 h-5" />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
              errors.category_id ? 'border-[#C58A2A]' : 'border-[#D7DCE1] focus:border-primary'
            }`}
            required
            disabled={loadingCategories}
          >
            <option value="">
              {loadingCategories ? 'Cargando categorías...' : 'Selecciona una categoría'}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-[#C58A2A]">{errors.category_id}</p>
          )}
        </div>
        {errors.category_id && (
          <p className="mt-1 text-sm text-[#C58A2A]">{errors.category_id}</p>
        )}
        {categories.length === 0 && !loadingCategories && (
          <p className="mt-1 text-sm text-[#C58A2A]">
            ⚠️ No hay categorías disponibles. Contacta al administrador.
          </p>
        )}
      </div>

      {/* Ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#07073b] mb-2">
            Ciudad *
          </label>
          <input
            type="text"
            name="location_city"
            value={formData.location_city}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
              errors.location_city ? 'border-[#C58A2A]' : 'border-[#D7DCE1] focus:border-primary'
            }`}
            placeholder="Cusco"
            required
          />
          {errors.location_city && (
            <p className="mt-1 text-sm text-[#C58A2A]">{errors.location_city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#07073b] mb-2">
            Región *
          </label>
          <input
            type="text"
            name="location_region"
            value={formData.location_region}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
              errors.location_region ? 'border-[#C58A2A]' : 'border-[#D7DCE1] focus:border-primary'
            }`}
            placeholder="Cusco"
            required
          />
          {errors.location_region && (
            <p className="mt-1 text-sm text-[#C58A2A]">{errors.location_region}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#07073b] mb-2">
            País *
          </label>
          <input
            type="text"
            name="location_country"
            value={formData.location_country}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none"
            placeholder="Peru"
            required
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2">
          Descripción *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none resize-y ${
            errors.description ? 'border-[#C58A2A]' : 'border-[#D7DCE1] focus:border-primary'
          }`}
          placeholder="Describe tu tour de manera atractiva..."
          required
        />
        <div className="flex items-center justify-between mt-1">
          {errors.description ? (
            <p className="text-sm text-[#C58A2A]">{errors.description}</p>
          ) : (
            <p className="text-sm text-[#5F6B76]">
              {formData.description.length}/500 caracteres
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourBasicInfo;
