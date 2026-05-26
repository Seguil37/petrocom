// src/features/agency/components/TourDetails.jsx

import { FileText, CheckCircle, XCircle, AlertTriangle, Calendar } from 'lucide-react';

const TourDetails = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: parseInt(value, 10) || 0 });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#07073b] mb-6">Detalles del expediente</h2>

      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Alcance *
        </label>
        <textarea
          name="itinerary"
          value={formData.itinerary}
          onChange={handleChange}
          rows="8"
          className="w-full px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none resize-y font-mono text-sm"
          placeholder="Etapa 1: Revision de requisitos OSINERGMIN&#10;Etapa 2: Elaboracion de planos, memorias y matriz de riesgo&#10;Etapa 3: Presentacion y seguimiento del expediente"
          required
        />
        <p className="text-sm text-[#5F6B76] mt-2">Describe el alcance por etapas o entregables tecnicos.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#07073b]" />
          Que incluye *
        </label>
        <textarea
          name="includes"
          value={formData.includes}
          onChange={handleChange}
          rows="6"
          className="w-full px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none resize-y"
          placeholder="• Revision tecnica&#10;• Planos y memorias&#10;• Plan de contingencia&#10;• Seguimiento de observaciones"
          required
        />
        <p className="text-sm text-[#5F6B76] mt-2">Lista los entregables incluidos en el servicio.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-[#C58A2A]" />
          Que no incluye *
        </label>
        <textarea
          name="excludes"
          value={formData.excludes}
          onChange={handleChange}
          rows="5"
          className="w-full px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none resize-y"
          placeholder="• Tasas administrativas de entidades&#10;• Adecuaciones fisicas no contratadas&#10;• Ensayos o certificados externos"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#C58A2A]" />
          Requisitos *
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows="5"
          className="w-full px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none resize-y"
          placeholder="• Datos del titular&#10;• Ubicacion del establecimiento&#10;• Documentacion tecnica disponible"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Condiciones del servicio *
        </label>
        <textarea
          name="cancellation_policy"
          value={formData.cancellation_policy}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none resize-y"
          placeholder="El alcance se confirma luego de revisar requisitos, documentos disponibles y actividad declarada."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#07073b] mb-2">Plazo de revision inicial *</label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            name="cancellation_hours"
            value={formData.cancellation_hours}
            onChange={handleNumberChange}
            className="w-32 px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none"
            min="0"
            required
          />
          <span className="text-[#5F6B76]">horas para revision inicial</span>
        </div>
        <p className="text-sm text-[#5F6B76] mt-2">Ejemplo: 24 horas para revisar documentos base y proponer ruta de trabajo.</p>
      </div>
    </div>
  );
};

export default TourDetails;
