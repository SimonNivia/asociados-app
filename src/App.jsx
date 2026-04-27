import { useState } from 'react';
import { loadSocios, saveSocios, getNextId } from './store.js';
import Dashboard from './Dashboard.jsx';
import Socios from './Socios.jsx';
import FormSocio from './FormSocio.jsx';
import { useToast, ToastContainer } from './Toast.jsx';

export default function App() {
  const [socios, setSocios] = useState(loadSocios);
  const [tab, setTab] = useState('dashboard');
  const [editing, setEditing] = useState(null);
  const { toasts, show } = useToast();

  const update = (next) => { setSocios(next); saveSocios(next); };

  const handleAdd = (data) => {
    const next = [...socios, { ...data, id: getNextId(socios) }];
    update(next);
    show('Socio registrado correctamente ✓');
    setTab('socios');
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este socio?')) return;
    update(socios.filter(s => s.id !== id));
    show('Socio eliminado', 'error');
  };

  const handleEdit = (socio) => setEditing(socio);

  const handleSaveEdit = (data) => {
    update(socios.map(s => s.id === editing.id ? { ...data, id: s.id } : s));
    setEditing(null);
    show('Cambios guardados ✓');
  };

  const total = socios.length;

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-icon">A</div>
          <span className="topbar-title">Gestión de Asociados</span>
        </div>
        <span className="topbar-badge">{total} {total === 1 ? 'socio' : 'socios'}</span>
      </header>

      <nav className="nav">
        {[['dashboard', 'Dashboard'], ['socios', 'Socios'], ['nuevo', '+ Nuevo socio']].map(([key, label]) => (
          <button
            key={key}
            className={`nav-btn${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >{label}</button>
        ))}
      </nav>

      {tab === 'dashboard' && <Dashboard socios={socios} />}
      {tab === 'socios' && <Socios socios={socios} onDelete={handleDelete} onEdit={handleEdit} />}
      {tab === 'nuevo' && <FormSocio onSave={handleAdd} />}

      {editing && (
        <FormSocio
          initial={editing}
          onSave={handleSaveEdit}
          onCancel={() => setEditing(null)}
          isModal
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
