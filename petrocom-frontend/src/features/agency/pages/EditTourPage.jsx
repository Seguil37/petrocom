// src/features/agency/pages/EditTourPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, PlusCircle, Trash2, ImagePlus } from 'lucide-react';
import { projectsApi, toPublicUrl } from '../../../shared/utils/api';
import { normalizeSentence, normalizeUrl, toTitleCase } from '../../../shared/utils/formNormalization';

const emptyImage = { path: '', caption: '', file: null, preview: '' };
const COUNTRIES = ['Peru'];
const PROJECT_TYPES = [
  'Residencial',
  'Comercial',
  'Industrial',
  'Interiorismo',
  'Habilitacion Urbana',
  'Saneamiento Inmobiliario',
  'Topografia',
];
const PERU_REGIONS = [
  'Amazonas',
  'Ancash',
  'Apurimac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huanuco',
  'Ica',
  'Junin',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martin',
  'Tacna',
  'Tumbes',
  'Ucayali',
];
const CITY_SUGGESTIONS = {
  Lima: ['Miraflores', 'San Isidro', 'Santiago de Surco', 'La Molina', 'Barranco', 'Cieneguilla'],
  Cusco: ['Cusco', 'San Sebastian', 'San Jeronimo', 'Wanchaq', 'Santiago', 'Zurite'],
  Arequipa: ['Cercado', 'Yanahuara', 'Cayma', 'Cerro Colorado'],
  Piura: ['Piura', 'Castilla', 'Catacaos'],
  'La Libertad': ['Trujillo', 'Victor Larco', 'Huanchaco'],
};
const SUMMARY_MAX = 180;

const EditTourPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    city: '',
    state: '',
    country: 'Peru',
    status: 'draft',
    is_featured: false,
    summary: '',
    description: '',
    hero_image: '',
    heroImageFile: null,
    images: [emptyImage],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [heroPreview, setHeroPreview] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsApi.show(id);
        const project = response.data;

        setFormData({
          title: project.title || '',
          type: project.type || '',
          city: project.city || '',
          state: project.state || '',
          country: project.country || 'Peru',
          status: project.status || 'draft',
          is_featured: !!project.is_featured,
          summary: project.summary || '',
          description: project.description || '',
          hero_image: project.hero_image || '',
          heroImageFile: null,
          images: (project.images && project.images.length ? project.images : [emptyImage]).map((img) => ({
            path: img.path || '',
            caption: img.caption || '',
            file: null,
	            preview: toPublicUrl(img.path || ''),
          })),
        });
	        setHeroPreview(toPublicUrl(project.hero_image || ''));
      } catch (error) {
        console.error('Error fetching project:', error);
        setSubmitError('No se pudo cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const openPreview = (url) => {
    if (!url || !url.trim()) return;
    window.open(toPublicUrl(url.trim()), '_blank', 'noopener,noreferrer');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleHeroFileChange = (file) => {
    if (heroPreview && heroPreview.startsWith('blob:')) {
      URL.revokeObjectURL(heroPreview);
    }
    setHeroPreview(file ? URL.createObjectURL(file) : toPublicUrl(formData.hero_image || ''));
    setFormData((prev) => ({
      ...prev,
      heroImageFile: file || null,
      hero_image: file ? '' : prev.hero_image,
    }));
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleGalleryFileChange = (index, file) => {
    const updatedImages = [...formData.images];
    const previousPreview = updatedImages[index]?.preview;

    if (previousPreview && previousPreview.startsWith('blob:')) {
      URL.revokeObjectURL(previousPreview);
    }

    updatedImages[index] = {
      ...updatedImages[index],
      file: file || null,
      preview: file ? URL.createObjectURL(file) : updatedImages[index].preview || updatedImages[index].path,
      path: file ? '' : updatedImages[index].path,
    };

    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, emptyImage] }));
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages.length ? updatedImages : [emptyImage] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El nombre del proyecto es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'Agrega una descripcion del proyecto';
    if (!['draft', 'published', 'archived'].includes(formData.status)) {
      newErrors.status = 'Selecciona un estado valido';
    }
    if (!formData.heroImageFile && !formData.hero_image.trim()) {
      newErrors.hero_image = 'Agrega una imagen principal';
    }

    const imagesWithContent = formData.images.filter((image) => image.path.trim() || image.file);
    if (imagesWithContent.length === 0) {
      newErrors.images = 'Agrega al menos una imagen del proyecto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = new FormData();
    payload.append('title', toTitleCase(formData.title));
    if (formData.type) payload.append('type', formData.type);
    if (formData.city) payload.append('city', toTitleCase(formData.city));
    if (formData.state) payload.append('state', toTitleCase(formData.state));
    if (formData.country) payload.append('country', toTitleCase(formData.country));
    payload.append('status', formData.status || 'draft');
    payload.append('is_featured', formData.is_featured ? '1' : '0');
    if (formData.summary) payload.append('summary', normalizeSentence(formData.summary));
    if (formData.description) payload.append('description', normalizeSentence(formData.description));

    if (formData.heroImageFile) {
      payload.append('hero_image_file', formData.heroImageFile);
    } else if (formData.hero_image.trim()) {
      payload.append('hero_image', normalizeUrl(formData.hero_image));
    }

    formData.images.forEach((image, index) => {
      if (image.file) {
        payload.append(`images[${index}][file]`, image.file);
      } else if (image.path.trim()) {
        payload.append(`images[${index}][path]`, normalizeUrl(image.path));
      }
      if (image.caption?.trim()) {
        payload.append(`images[${index}][caption]`, normalizeSentence(image.caption));
      }
    });

    try {
      await projectsApi.update(id, payload);
      navigate('/agency/tours');
    } catch (error) {
      const validationErrors = error.response?.data?.errors || {};
      setErrors(validationErrors);
      setSubmitError(error.response?.data?.message || 'No se pudo actualizar el proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  const heroPreviewSrc = heroPreview || toPublicUrl(formData.hero_image.trim());
  const cityHints = CITY_SUGGESTIONS[formData.state] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-8">
      <div className="container-custom max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/agency/tours')}
          className="flex items-center gap-2 text-[#5F6B76] hover:text-[#07073b] mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Volver a mis proyectos
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-[#D7DCE1] p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-[#5F6B76] uppercase tracking-widest">Editar proyecto</p>
              <h1 className="text-3xl font-black text-[#07073b]">Actualiza la informacion del proyecto</h1>
              <p className="text-[#303840]">Revisa los datos y la galeria antes de guardar.</p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Nombre del proyecto *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  onBlur={() => handleChange('title', toTitleCase(formData.title))}
                  className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Casa de campo en Cieneguilla"
                  minLength={4}
                />
                <p className="mt-1 text-xs text-[#5F6B76]">Usa un nombre claro y comercial para el portafolio.</p>
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Tipo de proyecto</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona un tipo</option>
                  {formData.type && !PROJECT_TYPES.includes(formData.type) && (
                    <option value={formData.type}>{formData.type}</option>
                  )}
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[#5F6B76]">Campo controlado para mantener reportes consistentes por tipo.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Ciudad o distrito</label>
                <input
                  type="text"
                  list="edit-project-city-suggestions"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  onBlur={() => handleChange('city', toTitleCase(formData.city))}
                  className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Miraflores, San Isidro, Cusco"
                />
                <datalist id="edit-project-city-suggestions">
                  {cityHints.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                <p className="mt-1 text-xs text-[#5F6B76]">
                  {formData.state
                    ? `Sugerencias para ${formData.state}: ${cityHints.join(', ') || 'sin sugerencias cargadas'}`
                    : 'Primero elige una region para ver sugerencias.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Departamento / region</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona una region</option>
                  {PERU_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Pais</label>
                <input
                  type="text"
                  list="edit-project-country-suggestions"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  onBlur={() => handleChange('country', toTitleCase(formData.country))}
                  className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Peru"
                />
                <datalist id="edit-project-country-suggestions">
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#07073b] mb-1">Estado *</label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                  <p className="mt-1 text-xs text-[#5F6B76]">Publicado aparece en la web. Borrador queda interno.</p>
                  {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <input
                    id="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleChange('is_featured', e.target.checked)}
                    className="w-4 h-4 text-primary border-[#D7DCE1] rounded focus:ring-primary"
                  />
                  <label htmlFor="is_featured" className="text-sm text-[#07073b] font-semibold">
                    Marcar como proyecto destacado
                  </label>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Resumen</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value.slice(0, SUMMARY_MAX))}
                  onBlur={() => handleChange('summary', normalizeSentence(formData.summary))}
                  className="w-full min-h-[120px] rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-y overflow-auto"
                  placeholder="Resume en una frase que se hizo y para quien fue pensado el proyecto."
                  maxLength={SUMMARY_MAX}
                />
                <p className="mt-1 text-xs text-[#5F6B76]">{formData.summary.length}/{SUMMARY_MAX} caracteres</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Descripcion detallada *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  onBlur={() => handleChange('description', normalizeSentence(formData.description))}
                  className="w-full min-h-[120px] rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-y overflow-auto"
                  placeholder="Describe el contexto, el objetivo del proyecto, la solucion propuesta y el resultado final."
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#07073b] mb-1">Imagen principal</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroFileChange(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  <div className="flex items-start gap-3">
                    <input
                      type="text"
                      value={formData.hero_image}
                      onChange={(e) => handleChange('hero_image', e.target.value)}
                      className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="URL de la imagen principal (opcional)"
                    />
                    <button
                      type="button"
                      onClick={() => openPreview(formData.hero_image)}
                      disabled={!formData.hero_image.trim()}
                      className="px-3 py-2 rounded-xl border border-[#D7DCE1] text-[#07073b] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ver
                    </button>
                  </div>
                  {heroPreviewSrc && (
                    <div className="mt-1">
                      <p className="text-xs text-[#5F6B76] mb-1">Previsualizacion</p>
                      <img
                        src={heroPreviewSrc}
                        alt="Previsualizacion de la imagen principal"
                        className="w-full max-w-sm max-h-48 object-contain rounded-lg border border-[#D7DCE1] bg-white"
                      />
                    </div>
                  )}
                  {errors.hero_image && <p className="text-sm text-red-600">{errors.hero_image}</p>}
                  <p className="text-xs text-[#5F6B76]">Puedes subir desde tu computadora o pegar un enlace publico.</p>
                </div>
              </div>
              <div className="bg-[#F4F5F6] rounded-xl border border-dashed border-[#D7DCE1] p-4 flex items-start gap-3">
                <ImagePlus className="w-5 h-5 text-[#C58A2A]" />
                <p className="text-sm text-[#303840]">
                  Las imagenes se guardan en storage en una carpeta por proyecto (id-slug) para servirlas como archivos
                  locales.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#07073b]">Galeria del proyecto</h2>
                  <p className="text-sm text-[#5F6B76]">
                    Puedes subir archivos o pegar URLs publicas. Incluye al menos una imagen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D7DCE1] text-[#07073b] hover:border-primary"
                >
                  <PlusCircle className="w-4 h-4" /> Anadir imagen
                </button>
              </div>

              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-[#ffffff] p-4 rounded-xl border border-[#D7DCE1]"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <label className="block text-sm font-semibold text-[#07073b] mb-1">Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryFileChange(index, e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      />
                      <input
                        type="text"
                        value={image.path}
                        onChange={(e) => handleImageChange(index, 'path', e.target.value)}
                        className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="URL publica de la imagen (opcional)"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openPreview(image.path)}
                          disabled={!image.path.trim()}
                          className="px-3 py-2 rounded-xl border border-[#D7DCE1] text-[#07073b] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Ver enlace
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="px-3 py-2 rounded-xl border border-[#D7DCE1] text-[#C58A2A] hover:border-[#C58A2A]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <label className="block text-sm font-semibold text-[#07073b] mb-1">Leyenda</label>
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                        onBlur={() => handleImageChange(index, 'caption', normalizeSentence(image.caption))}
                        className="w-full rounded-xl border border-[#D7DCE1] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Texto descriptivo de la imagen"
                      />
                    </div>
                    <div className="md:col-span-2">
                      {image.preview || image.path.trim() ? (
                        <img
                          src={image.preview || image.path.trim()}
                          alt={image.caption || `Imagen ${index + 1}`}
                          className="w-full h-48 object-cover rounded-xl border border-[#D7DCE1] bg-white"
                        />
                      ) : (
                        <div className="w-full h-48 rounded-xl border-2 border-dashed border-[#D7DCE1] flex items-center justify-center text-[#5F6B76]">
                          Previsualizacion
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
              </div>
            </section>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={() => navigate('/agency/tours')} className="flex-1 border rounded-lg py-3">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-primary text-white font-bold py-3 rounded-lg disabled:opacity-60"
              >
                {submitting ? 'Guardando...' : 'Actualizar proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTourPage;
