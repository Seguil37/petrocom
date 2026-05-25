import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save, Layers, ListChecks, Search, Trash2 } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import { normalizeSentence, toTitleCase } from '../../../shared/utils/formNormalization';
import useAuthStore from '../../../store/authStore';
import { MODULES, canAccessModule } from '../../../shared/constants/roles';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';

const emptyPhase = (order = 1) => ({ name: '', order, description: '', subphases: [] });
const emptySubphase = (order = 1) => ({ name: '', order, description: '' });
const TYPES_PER_PAGE = 6;

const TramiteTypesPage = () => {
  const { user } = useAuthStore();
  const inputClass =
    'w-full rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 text-[#07073b] outline-none placeholder-[#5F6B76] focus:border-[#238A55] focus:ring-2 focus:ring-[#A8D8BA]';
  const labelClass = 'mb-1 block text-sm font-semibold text-[#07073b]';
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
    phases: [emptyPhase()],
  });

  useEffect(() => {
    loadTypes();
  }, []);

  const codeSuggestion = useMemo(() => buildTypeCodeSuggestion(form.name), [form.name]);

  const filteredTypes = useMemo(() => {
    const words = normalizeSearchText(searchTerm).split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      return types;
    }

    return types.filter((type) => {
      const phaseText = (type.phases || [])
        .flatMap((phase) => [
          phase.name,
          phase.description,
          ...(phase.subphases || []).flatMap((subphase) => [subphase.name, subphase.description]),
        ])
        .join(' ');
      const statusText = type.is_active ? 'activo disponible publicado' : 'inactivo oculto desactivado';
      const searchableText = normalizeSearchText(
        [type.code, type.name, type.description, statusText, phaseText].filter(Boolean).join(' ')
      );

      return words.every((word) => searchableText.includes(word));
    });
  }, [types, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredTypes.length / TYPES_PER_PAGE));

  const paginatedTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * TYPES_PER_PAGE;
    return filteredTypes.slice(startIndex, startIndex + TYPES_PER_PAGE);
  }, [filteredTypes, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const { data } = await tramitesApi.listTypes();
      setTypes(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar los tipos de tramite.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      is_active: true,
      phases: [emptyPhase()],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        name: toTitleCase(form.name),
        description: normalizeSentence(form.description),
        phases: form.phases.map((phase) => ({
          ...phase,
          name: toTitleCase(phase.name),
          description: normalizeSentence(phase.description),
          subphases: (phase.subphases || []).map((subphase) => ({
            ...subphase,
            name: toTitleCase(subphase.name),
            description: normalizeSentence(subphase.description),
          })),
        })),
      };

      if (editingId) {
        await tramitesApi.updateType(editingId, payload);
      } else {
        await tramitesApi.createType(payload);
      }

      await loadTypes();
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setForm({
      name: type.name,
      description: type.description || '',
      is_active: Boolean(type.is_active),
      phases:
        type.phases?.map((phase, phaseIndex) => ({
          name: phase.name,
          order: phaseIndex + 1,
          description: phase.description || '',
          subphases:
            phase.subphases?.map((subphase, subIndex) => ({
              name: subphase.name,
              order: subIndex + 1,
              description: subphase.description || '',
            })) || [],
        })) || [emptyPhase()],
    });
  };

  const handleDeleteType = async (type) => {
    if (!window.confirm(`¿Eliminar el tipo de trámite "${type.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeletingId(type.id);
      await tramitesApi.deleteType(type.id);

      if (editingId === type.id) {
        resetForm();
      }

      await loadTypes();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo eliminar el tipo de tramite.');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePhaseChange = (index, field, value) => {
    const updated = [...form.phases];
    updated[index][field] = value;
    setForm({ ...form, phases: updated });
  };

  const handleSubphaseChange = (phaseIndex, subIndex, field, value) => {
    const updated = [...form.phases];
    updated[phaseIndex].subphases[subIndex][field] = value;
    setForm({ ...form, phases: updated });
  };

  const addPhase = () => {
    const nextOrder = form.phases.length + 1;
    setForm({ ...form, phases: [...form.phases, emptyPhase(nextOrder)] });
  };

  const addSubphase = (phaseIndex) => {
    const updated = [...form.phases];
    const nextOrder = (updated[phaseIndex].subphases?.length || 0) + 1;
    updated[phaseIndex].subphases.push(emptySubphase(nextOrder));
    setForm({ ...form, phases: updated });
  };

  const removePhase = (phaseIndex) => {
    const updated = form.phases
      .filter((_, index) => index !== phaseIndex)
      .map((phase, index) => ({
        ...phase,
        order: index + 1,
      }));

    setForm({
      ...form,
      phases: updated.length > 0 ? updated : [emptyPhase()],
    });
  };

  const removeSubphase = (phaseIndex, subIndex) => {
    const updated = [...form.phases];
    updated[phaseIndex] = {
      ...updated[phaseIndex],
      subphases: updated[phaseIndex].subphases
        .filter((_, index) => index !== subIndex)
        .map((subphase, index) => ({
          ...subphase,
          order: index + 1,
        })),
    };

    setForm({ ...form, phases: updated });
  };

  if (!canAccessModule(user, MODULES.TRAMITE_TYPES)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F6] font-semibold text-[#07073b]">
        No tienes permiso para administrar tipos de tramite.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex justify-end">
          <AdminPanelBackButton />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Layers className="h-6 w-6 text-[#238A55]" />
            <div>
              <h1 className="text-2xl font-black text-[#07073b]">
                {editingId ? 'Editar tipo de tramite' : 'Crear tipo de tramite'}
              </h1>
              <p className="text-sm text-[#5F6B76]">Define fases y subfases reutilizables.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Codigo generado</label>
                <div className="rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 font-semibold text-[#07073b]">
                  {codeSuggestion || 'Se generara al guardar'}
                </div>
                <p className="mt-1 text-xs text-[#5F6B76]">
                  El sistema genera este codigo automaticamente a partir del nombre y evita duplicados.
                </p>
              </div>

              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => setForm((prev) => ({ ...prev, name: toTitleCase(prev.name) }))}
                  className={inputClass}
                  placeholder="Ej: Licencia de obra"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripcion</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                onBlur={() => setForm((prev) => ({ ...prev, description: normalizeSentence(prev.description) }))}
                className={`${inputClass} min-h-[80px]`}
                placeholder="Explica para que sirve este tipo de tramite y cuando se usa."
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#D7DCE1] bg-[#ffffff] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#07073b]">Estado del tipo</p>
                <p className="text-xs text-[#5F6B76]">
                  {form.is_active ? 'Disponible para nuevos tramites.' : 'Oculto para nuevas asignaciones.'}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="h-6 w-11 rounded-full bg-[#D7DCE1] transition-colors peer-checked:bg-[#238A55]"></div>
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#07073b]">Fases</h3>
                <button
                  type="button"
                  onClick={addPhase}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#07073b] px-4 py-2 font-semibold text-white transition hover:bg-[#05052f]"
                >
                  <Plus className="h-4 w-4" />
                  Añadir fase
                </button>
              </div>

              {form.phases.map((phase, idx) => (
                <div key={idx} className="rounded-xl border border-[#D7DCE1] bg-[#ffffff] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex rounded-full bg-[#07073b] px-3 py-1 text-xs font-semibold text-white">
                      Fase {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhase(idx)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar fase
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Nombre</label>
                      <input
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(idx, 'name', e.target.value)}
                        onBlur={() => handlePhaseChange(idx, 'name', toTitleCase(phase.name))}
                        className={inputClass}
                        placeholder="Ej: Recepcion documental"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Orden automatico</label>
                      <div className="rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 font-semibold text-[#07073b]">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Descripcion (opcional)</label>
                      <textarea
                        value={phase.description}
                        onChange={(e) => handlePhaseChange(idx, 'description', e.target.value)}
                        onBlur={() => handlePhaseChange(idx, 'description', normalizeSentence(phase.description))}
                        className={`${inputClass} min-h-[72px] resize-y`}
                        placeholder="Ej: Revision inicial de documentos y requisitos."
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#07073b]">
                        <ListChecks className="h-4 w-4 text-[#238A55]" />
                        Subfases
                      </div>
                      <button
                        type="button"
                        onClick={() => addSubphase(idx)}
                        className="rounded-lg border border-[#238A55] px-3 py-2 font-semibold text-[#238A55] transition hover:bg-[#E9F3EE]"
                      >
                        + Subfase
                      </button>
                    </div>

                    <div className="space-y-2">
                      {phase.subphases.map((subphase, subIndex) => (
	                        <div
	                          key={subIndex}
	                          className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(220px,1fr)_80px_minmax(260px,1.2fr)_120px] md:items-start"
	                        >
                          <input
                            value={subphase.name}
                            onChange={(e) => handleSubphaseChange(idx, subIndex, 'name', e.target.value)}
                            onBlur={() => handleSubphaseChange(idx, subIndex, 'name', toTitleCase(subphase.name))}
                            placeholder="Ej: Validacion de planos"
                            className={inputClass}
                          />
	                          <div className="rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 font-semibold text-[#07073b]">
	                            {subIndex + 1}
	                          </div>
                          <textarea
                            value={subphase.description}
                            onChange={(e) => handleSubphaseChange(idx, subIndex, 'description', e.target.value)}
                            onBlur={() => handleSubphaseChange(idx, subIndex, 'description', normalizeSentence(subphase.description))}
                            placeholder="Descripcion opcional"
	                            className={`${inputClass} min-h-[44px] resize-y`}
	                          />
	                          <button
	                            type="button"
	                            onClick={() => removeSubphase(idx, subIndex)}
	                            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                            title="Eliminar subfase"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addPhase}
                className="order-last ml-auto inline-flex items-center gap-2 rounded-xl bg-[#07073b] px-4 py-3 font-semibold text-white transition hover:bg-[#05052f]"
              >
                <Plus className="h-4 w-4" />
                Añadir fase
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-bold text-white shadow-md transition hover:shadow-lg"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="rounded-lg border border-[#238A55] px-3 py-2 font-semibold text-[#238A55] transition hover:bg-[#E9F3EE]"
                  onClick={resetForm}
                >
                  Cancelar edicion
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg">
          <div className="mb-4 space-y-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-[#238A55]" />
              <h2 className="text-xl font-black text-[#07073b]">Tipos registrados</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6B76]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="Buscar por codigo, nombre, estado, fase o subfase"
              />
            </div>
            <p className="text-xs text-[#5F6B76]">
              {filteredTypes.length} tipo(s) encontrado(s).
            </p>
          </div>
          {loading ? (
            <div className="text-center text-[#5F6B76]">Cargando...</div>
          ) : types.length === 0 ? (
            <div className="text-[#5F6B76]">Aun no hay tipos.</div>
          ) : filteredTypes.length === 0 ? (
            <div className="text-[#5F6B76]">No se encontraron tipos con esa busqueda.</div>
          ) : (
            <div className="space-y-3">
              {paginatedTypes.map((type) => (
                <div
                  key={type.id}
                  className="w-full rounded-xl border border-[#D7DCE1] bg-[#ffffff] p-4 transition hover:shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#238A55]">{type.code}</p>
                      <p className="text-lg font-bold text-[#07073b]">{type.name}</p>
                      <p className="text-sm text-[#5F6B76]">{type.phases?.length || 0} fases</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        type.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {type.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(type)}
                      className="rounded-lg border border-[#07073b] px-3 py-2 text-sm font-semibold text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteType(type)}
                      disabled={deletingId === type.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === type.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="text-sm text-[#5F6B76]">
                    Pagina {currentPage} de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D7DCE1] px-3 py-2 font-semibold text-[#07073b] transition hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D7DCE1] px-3 py-2 font-semibold text-[#07073b] transition hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

const buildTypeCodeSuggestion = (name = '') => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase())
    .filter(Boolean);

  return words.join('-');
};

const normalizeSearchText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default TramiteTypesPage;
