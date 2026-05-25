// src/features/services/pages/AdminServicesPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi, toPublicUrl } from '../../../shared/utils/api';
import { normalizeSentence, normalizeUrl, toTitleCase } from '../../../shared/utils/formNormalization';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ImagePlus,
  Eye,
  CheckCircle,
  TrendingUp,
  Archive,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const SERVICE_STATUS_CONFIG = {
  published: { label: 'Publicado', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  draft: { label: 'Borrador', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: null },
  archived: { label: 'Archivado', bg: 'bg-gray-100', text: 'text-gray-700', icon: Archive },
};

const emptyImage = { path: '', caption: '', file: null, preview: '' };
const SERVICE_CATEGORIES = [
  'Tramites y regularizacion inmobiliaria',
  'Arquitectura',
  'Ingenieria',
  'Dise�o interior',
  'Asesoria inmobiliaria',
  'Tasaciones',
];
const SUMMARY_MAX = 180;

const emptyForm = {
  title: '',
  category: '',
  short_description: '',
  description: '',
  status: 'published',
  featured: false,
  cover_image: '',
  coverImageFile: null,
  images: [emptyImage],
};

const translateMessage = (msg = '') => {
  const text = msg.toLowerCase();
  if (text.includes('cover image field is required when cover image file is not present')) {
    return 'La imagen principal es obligatoria cuando no adjuntas un archivo.';
  }
  return msg;
};

const AdminServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    setForm(emptyForm);
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.list({ per_page: 200, status: 'all' });
      const data = response.data?.data ?? response.data ?? [];
      setServices(data);
    } catch (error) {
      console.error('Error al cargar servicios', error);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (url) => {
    if (!url || !url.trim()) return;
    window.open(toPublicUrl(url.trim()), '_blank', 'noopener,noreferrer');
  };

  const viewService = (service) => {
    if (!service) return;
    const url = service.public_url?.trim() || (service.slug ? `/services/${service.slug}` : `/services/${service.id}`);
    navigate(url);
  };

  const handleImageChange = (index, field, value) => {
    const updated = [...form.images];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, images: updated });
  };

  const handleGalleryFileChange = (index, file) => {
    const updated = [...form.images];
    const previousPreview = updated[index]?.preview;

    if (previousPreview && previousPreview.startsWith('blob:')) {
      URL.revokeObjectURL(previousPreview);
    }

    updated[index] = {
      ...updated[index],
      file: file || null,
      preview: file ? URL.createObjectURL(file) : updated[index].preview || updated[index].path,
      path: file ? '' : updated[index].path,
    };

    setForm({ ...form, images: updated });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, emptyImage] });
  };

  const removeImageField = (index) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updated.length ? updated : [emptyImage] });
  };

  const handleCoverFileChange = (file) => {
    if (coverPreview && coverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview(file ? URL.createObjectURL(file) : toPublicUrl(form.cover_image || ''));
    setForm({ ...form, coverImageFile: file || null, cover_image: file ? '' : form.cover_image });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    const imagesPayload = [];
    form.images.forEach((image, index) => {
      if (image.file) {
        imagesPayload.push({ type: 'file', file: image.file, caption: image.caption, index });
      } else if (image.path.trim()) {
        imagesPayload.push({ type: 'path', path: normalizeUrl(image.path), caption: image.caption, index });
      }
    });

    const payload = new FormData();
    payload.append('title', toTitleCase(form.title));
    if (form.category) payload.append('category', toTitleCase(form.category));
    if (form.short_description) payload.append('short_description', normalizeSentence(form.short_description));
    if (form.description) payload.append('description', normalizeSentence(form.description));
    payload.append('status', form.status || 'published');
    payload.append('featured', form.featured ? '1' : '0');

    if (form.coverImageFile) {
      payload.append('cover_image_file', form.coverImageFile);
    } else if (form.cover_image.trim()) {
      payload.append('cover_image', normalizeUrl(form.cover_image));
    }

    imagesPayload.forEach((image) => {
      if (image.type === 'file') {
        payload.append(`images[${image.index}][file]`, image.file);
      } else {
        payload.append(`images[${image.index}][path]`, image.path);
      }
      if (image.caption?.trim()) {
        payload.append(`images[${image.index}][caption]`, normalizeSentence(image.caption));
      }
    });

    try {
      if (editing) {
        await servicesApi.update(editing.id, payload);
      } else {
        await servicesApi.create(payload);
      }
      setForm(emptyForm);
      setCoverPreview('');
      setEditing(null);
      await loadServices();
    } catch (error) {
      console.error('Error guardando servicio', error);
      const coverError =
        error.response?.data?.errors?.cover_image?.[0] ||
        error.response?.data?.errors?.cover_image_file?.[0];
      const apiMessage = translateMessage(error.response?.data?.message || coverError);
      setSubmitError(apiMessage || 'No se pudo guardar el servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setForm({
      ...emptyForm,
      title: service.title || '',
      category: service.category || emptyForm.category,
      short_description: service.short_description || '',
      description: service.description || '',
      status: service.status || 'draft',
      featured: Boolean(service.featured),
      cover_image: service.cover_image || '',
      coverImageFile: null,
      images:
        service.gallery?.length > 0
          ? service.gallery.map((image) => ({
              path: image.path || '',
              caption: image.caption || '',
              file: null,
              preview: toPublicUrl(image.path || ''),
            }))
          : [emptyImage],
    });
    setCoverPreview(toPublicUrl(service.cover_image || ''));
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este servicio?')) return;
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error eliminando servicio', error);
    }
  };

  const filtered = services.filter((service) =>
    service.title?.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const startIndex = (currentPage - 1) * perPage;
  const paginatedServices = filtered.slice(startIndex, startIndex + perPage);

  const scrollToListTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToListTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToListTop();
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const coverPreviewSrc = coverPreview || toPublicUrl(form.cover_image.trim());

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-8">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <h1 className="text-3xl font-black text-[#07073b]">Servicios</h1>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap xl:justify-end">
              <span className="text-sm text-[#65647a]">{filtered.length} servicios</span>
              <AdminPanelBackButton />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 mb-4 flex items-center gap-3">
            <Search className="text-[#65647a]" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por titulo"
              className="w-full outline-none"
            />
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl shadow p-6 text-center text-[#65647a]">
                No se encontraron servicios.
              </div>
            )}

            {paginatedServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
                <img
                  src={toPublicUrl(service.cover_image || service.gallery?.[0]?.path) || 'https://via.placeholder.com/120x90'}
                  alt={service.title}
                  className="w-24 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <p className="text-xs uppercase text-[#65647a]">{service.category}</p>
                  <h3 className="text-lg font-bold text-[#07073b]">{service.title}</h3>
                  <p className="text-sm text-[#65647a] line-clamp-2">{service.short_description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {(() => {
                      const cfg = SERVICE_STATUS_CONFIG[service.status] || SERVICE_STATUS_CONFIG.draft;
                      const Icon = cfg.icon;
                      return (
                        <span className={`inline-flex items-center gap-1 text-xs ${cfg.text} ${cfg.bg} px-2 py-1 rounded-full whitespace-nowrap`}>
                          {Icon && <Icon className="w-4 h-4" />}
                          {cfg.label}
                        </span>
                      );
                    })()}
                    {service.featured && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
                        <TrendingUp className="w-4 h-4" /> Destacado
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewService(service)}
                    className="p-2 rounded-lg bg-[#f3f4f6] text-[#07073b] hover:bg-[#dfe2ea] transition-transform hover:scale-105"
                    title="Ver servicio publicado"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg bg-[#f3f4f6] hover:bg-[#dfe2ea]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-lg bg-[#eef8f1] text-[#e8a12f] hover:bg-[#eef8f1]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
              <div className="text-sm text-[#65647a]">
                Mostrando{' '}
                <span className="font-bold text-[#07073b]">
                  {filtered.length === 0 ? 0 : startIndex + 1}
                </span>{' '}
                a{' '}
                <span className="font-bold text-[#07073b]">
                  {Math.min(startIndex + perPage, filtered.length)}
                </span>{' '}
                de <span className="font-bold text-[#07073b]">{filtered.length}</span> servicios
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#dfe2ea] hover:bg-[#f3f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#07073b]" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        scrollToListTop();
                      }}
                      className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-gradient-primary text-white'
                          : 'border border-[#dfe2ea] text-[#65647a] hover:bg-[#f3f4f6]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || filtered.length === 0}
                  className="p-2 rounded-lg border border-[#dfe2ea] hover:bg-[#f3f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#07073b]" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-[#07073b]">
              {editing ? 'Editar servicio' : 'Crear servicio'}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-[#454546]">Titulo</label>
              <input
                required
                className="w-full border rounded-lg p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onBlur={() => setForm((prev) => ({ ...prev, title: toTitleCase(prev.title) }))}
                placeholder="Ej: Apertura de carpeta predial"
              />
              <p className="mt-1 text-xs text-[#65647a]">Usa un titulo unico y descriptivo. Se corrige a formato titulo.</p>
            </div>

            <div>
              <label className="text-sm text-[#454546]">Categoria</label>
              <select
                className="w-full border rounded-lg p-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Selecciona una categoria</option>
                {form.category && !SERVICE_CATEGORIES.includes(form.category) && (
                  <option value={form.category}>{form.category}</option>
                )}
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[#65647a]">
                Campo controlado: usa una categoria existente para que los reportes agrupen bien.
              </p>
            </div>

            <div>
              <label className="text-sm text-[#454546]">Resumen</label>
              <textarea
                required
                className="w-full border rounded-lg p-3 min-h-[100px] resize-y overflow-auto"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value.slice(0, SUMMARY_MAX) })}
                onBlur={() => setForm((prev) => ({ ...prev, short_description: normalizeSentence(prev.short_description) }))}
                placeholder="Resume en una frase que problema resuelve el servicio y para quien es."
                maxLength={SUMMARY_MAX}
              />
              <p className="mt-1 text-xs text-[#65647a]">{form.short_description.length}/{SUMMARY_MAX} caracteres</p>
            </div>

            <div>
              <label className="text-sm text-[#454546]">Descripcion</label>
              <textarea
                required
                className="w-full border rounded-lg p-3 min-h-[140px] resize-y overflow-auto"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                onBlur={() => setForm((prev) => ({ ...prev, description: normalizeSentence(prev.description) }))}
                placeholder="Explica que incluye el servicio, a quien va dirigido, que documentos pide y cual es el resultado esperado."
              />
              <p className="mt-1 text-xs text-[#65647a]">Estructura recomendada: incluye, publico objetivo, requisitos y resultado esperado.</p>
            </div>

            <div>
              <label className="text-sm text-[#454546]">Imagen principal</label>
              <div className="space-y-3">
                <p className="text-xs text-[#65647a]">Prioriza subir un archivo. Usa URL solo si ya tienes una imagen publicada.</p>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => handleCoverFileChange(e.target.files?.[0] || null)}
                />
                <div className="flex items-start gap-3">
                  <input
                    className="w-full border rounded-lg p-2"
                    value={form.cover_image}
                    onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                    placeholder="URL publica de respaldo (opcional)"
                  />
                  <button
                    type="button"
                    onClick={() => openPreview(form.cover_image)}
                    disabled={!form.cover_image.trim()}
                    className="px-3 py-2 rounded-lg border border-[#dfe2ea] text-[#07073b] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ver
                  </button>
                </div>
                {coverPreviewSrc && (
                  <div className="mt-2">
                    <p className="text-xs text-[#65647a] mb-1">Previsualizacion</p>
                    <img
                      src={coverPreviewSrc}
                      alt={form.title || 'Portada del servicio'}
                      className="w-full h-40 object-cover rounded-xl border border-[#dfe2ea]"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[#454546]">Estado</label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={form.status || 'published'}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                  </select>
                  <p className="mt-1 text-xs text-[#65647a]">Publicado aparece en la web. Borrador queda interno.</p>
                </div>

              <label className="flex items-center gap-2 text-sm text-[#454546] mt-6">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Destacado
              </label>
            </div>

            <div className="border border-dashed border-[#dfe2ea] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ImagePlus className="w-4 h-4 text-[#e8a12f]" />
                <p className="text-sm font-semibold text-[#07073b]">Galeria del servicio</p>
              </div>

              <div className="space-y-3">
                {form.images.map((image, index) => (
                  <div key={index} className="bg-[#ffffff] p-3 rounded-lg border border-[#dfe2ea] space-y-2">
                    <label className="text-xs text-[#454546] block">Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border rounded-lg p-2"
                      onChange={(e) => handleGalleryFileChange(index, e.target.files?.[0] || null)}
                    />
                    <div className="flex items-start gap-2">
                      <input
                        className="w-full border rounded-lg p-2"
                        value={image.path}
                        onChange={(e) => handleImageChange(index, 'path', e.target.value)}
                        placeholder="URL publica (opcional)"
                      />
                      <button
                        type="button"
                        onClick={() => openPreview(image.path)}
                        disabled={!image.path.trim()}
                        className="px-2 py-2 rounded-lg border border-[#dfe2ea] text-[#07073b] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-2 py-2 rounded-lg border border-[#dfe2ea] text-[#e8a12f] hover:border-[#e8a12f]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <label className="text-xs text-[#454546] block">Leyenda</label>
                    <input
                      className="w-full border rounded-lg p-2"
                      value={image.caption}
                      onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                      onBlur={() => handleImageChange(index, 'caption', normalizeSentence(image.caption))}
                      placeholder="Detalle de la imagen"
                    />
                    {(image.preview || image.path.trim()) && (
                      <img
                        src={image.preview || image.path.trim()}
                        alt={image.caption || `Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#dfe2ea] mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageField}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#dfe2ea] text-[#07073b] hover:border-primary"
              >
                <Plus className="w-4 h-4" /> Agregar imagen
              </button>
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex gap-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyForm);
                    setCoverPreview('');
                    setSubmitError('');
                  }}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-primary text-white font-bold py-2 rounded-lg disabled:opacity-60"
              >
                {submitting ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminServicesPage;
