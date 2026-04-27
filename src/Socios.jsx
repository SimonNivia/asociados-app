import { useState } from 'react';

function Badge({ type, label }) {
  const cls = {
    Activo: 'badge-activo', Inactivo: 'badge-inactivo',
    'Al día': 'badge-al-dia', Moroso: 'badge-moroso',
  }[label] || 'badge-cat';
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function Socios({ socios, onDelete, onEdit }) {
  const [query, setQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterPago, setFilterPago] = useState('Todos');

  const filtered = socios.filter(s => {
    const matchQ = !query || s.nombre.toLowerCase().includes(query.toLowerCase()) || s.dni.includes(query);
    const matchE = filterEstado === 'Todos' || s.estado === filterEstado;
    const matchP = filterPago === 'Todos' || s.pago === filterPago;
    return matchQ && matchE && matchP;
  });

  return (
    <div className="content">
      <div className="table-wrapper">
        <div className="table-header">
          <span className="table-header-title">Listado de socios ({filtered.length})</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              className="search-input"
              placeholder="Buscar por nombre o DNI..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: 12, padding: '5px 8px' }}
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value)}
            >
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: 12, padding: '5px 8px' }}
              value={filterPago}
              onChange={e => setFilterPago(e.target.value)}
            >
              <option>Todos</option>
              <option>Al día</option>
              <option>Moroso</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No se encontraron socios con esos filtros.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Categoría</th>
                  <th>Cuota</th>
                  <th>Estado</th>
                  <th>Pago</th>
                  <th>Ingreso</th>
                  <th style={{ width: 70 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td title={s.nombre}>{s.nombre}</td>
                    <td>{s.dni}</td>
                    <td><span className="badge badge-cat">{s.categoria}</span></td>
                    <td>${(s.cuota || 0).toLocaleString('es-AR')}</td>
                    <td><Badge label={s.estado} /></td>
                    <td><Badge label={s.pago} /></td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.fechaIngreso || '—'}</td>
                    <td>
                      <button className="btn-edit" title="Editar" onClick={() => onEdit(s)}>✎</button>
                      <button className="btn-del" title="Eliminar" onClick={() => onDelete(s.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
