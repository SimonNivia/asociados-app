import { useState, useEffect } from 'react';

const empty = { nombre: '', dni: '', categoria: 'Titular', cuota: '', estado: 'Activo', pago: 'Al día', fechaIngreso: '', email: '', telefono: '' };

export default function FormSocio({ initial, onSave, onCancel, isModal = false }) {
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  const set = (k, v) => { setForm(prev => ({ ...prev, [k]: v })); setErrors(prev => ({ ...prev, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    if (!form.dni.trim()) e.dni = 'El DNI es obligatorio.';
    else if (!/^\d{7,9}$/.test(form.dni.replace(/[-.\s]/g, ''))) e.dni = 'DNI inválido (7-9 dígitos).';
    if (form.cuota !== '' && isNaN(Number(form.cuota))) e.cuota = 'Debe ser un número.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, cuota: Number(form.cuota) || 0 });
    if (!initial) setForm(empty);
  };

  const Field = ({ label, id, children }) => (
    <div className={`form-group${id === 'nombre' || id === 'email' ? ' full' : ''}`}>
      <label className="form-label" htmlFor={id}>{label}</label>
      {children}
      {errors[id] && <div className="form-error">{errors[id]}</div>}
    </div>
  );

  const content = (
    <>
      {isModal && <div className="modal-title">{initial ? 'Editar socio' : 'Nuevo socio'}</div>}
      {!isModal && <div className="form-section-title">Datos del socio</div>}
      <div className="form-grid">
        <Field label="Nombre completo *" id="nombre">
          <input id="nombre" className={`form-input${errors.nombre ? ' error' : ''}`} value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: María González" />
        </Field>
        <Field label="DNI *" id="dni">
          <input id="dni" className="form-input" value={form.dni} onChange={e => set('dni', e.target.value)} placeholder="Ej: 30123456" />
        </Field>
        <Field label="Email" id="email">
          <input id="email" className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com" />
        </Field>
        <Field label="Teléfono" id="telefono">
          <input id="telefono" className="form-input" value={form.telefono || ''} onChange={e => set('telefono', e.target.value)} placeholder="Ej: 3764-123456" />
        </Field>
        <Field label="Categoría" id="categoria">
          <select id="categoria" className="form-select" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            <option>Titular</option>
            <option>Adherente</option>
            <option>Juvenil</option>
            <option>Honorario</option>
          </select>
        </Field>
        <Field label="Cuota mensual ($)" id="cuota">
          <input id="cuota" className="form-input" type="number" min="0" value={form.cuota} onChange={e => set('cuota', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Estado de membresía" id="estado">
          <select id="estado" className="form-select" value={form.estado} onChange={e => set('estado', e.target.value)}>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </Field>
        <Field label="Estado de pago" id="pago">
          <select id="pago" className="form-select" value={form.pago} onChange={e => set('pago', e.target.value)}>
            <option>Al día</option>
            <option>Moroso</option>
          </select>
        </Field>
        <Field label="Fecha de ingreso" id="fechaIngreso">
          <input id="fechaIngreso" className="form-input" type="date" value={form.fechaIngreso || ''} onChange={e => set('fechaIngreso', e.target.value)} />
        </Field>
      </div>
      <div className={isModal ? 'modal-actions' : 'form-actions'} style={{ marginTop: '1.25rem' }}>
        {onCancel && <button className="btn-secondary" onClick={onCancel}>Cancelar</button>}
        {!onCancel && <button className="btn-secondary" onClick={() => setForm(empty)}>Limpiar</button>}
        <button className="btn-primary" onClick={handleSave}>
          {initial ? 'Guardar cambios' : 'Registrar socio'}
        </button>
      </div>
    </>
  );

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
        <div className="modal">{content}</div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="form-card">{content}</div>
    </div>
  );
}
