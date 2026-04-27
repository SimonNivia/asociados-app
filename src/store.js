const STORAGE_KEY = 'asociados_data';

const defaultData = [
  { id: 1, nombre: 'Ana Ramírez', dni: '28456789', categoria: 'Titular', cuota: 5000, estado: 'Activo', pago: 'Al día', fechaIngreso: '2023-03-15', email: 'ana@ejemplo.com', telefono: '3764-123456' },
  { id: 2, nombre: 'Carlos Medina', dni: '31987654', categoria: 'Adherente', cuota: 3000, estado: 'Activo', pago: 'Moroso', fechaIngreso: '2023-06-01', email: 'carlos@ejemplo.com', telefono: '3764-234567' },
  { id: 3, nombre: 'Laura Espíndola', dni: '25678901', categoria: 'Titular', cuota: 5000, estado: 'Inactivo', pago: 'Al día', fechaIngreso: '2022-11-20', email: 'laura@ejemplo.com', telefono: '3764-345678' },
  { id: 4, nombre: 'Rodrigo Páez', dni: '33112233', categoria: 'Juvenil', cuota: 1500, estado: 'Activo', pago: 'Al día', fechaIngreso: '2024-01-10', email: 'rodrigo@ejemplo.com', telefono: '3764-456789' },
  { id: 5, nombre: 'Marta Zárate', dni: '22334455', categoria: 'Honorario', cuota: 0, estado: 'Activo', pago: 'Al día', fechaIngreso: '2021-05-08', email: 'marta@ejemplo.com', telefono: '3764-567890' },
  { id: 6, nombre: 'Diego Coppola', dni: '35678900', categoria: 'Adherente', cuota: 3000, estado: 'Inactivo', pago: 'Moroso', fechaIngreso: '2023-09-14', email: 'diego@ejemplo.com', telefono: '3764-678901' },
];

export function loadSocios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultData;
}

export function saveSocios(socios) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
  } catch {}
}

export function getStats(socios) {
  const total = socios.length;
  const activos = socios.filter(s => s.estado === 'Activo').length;
  const inactivos = socios.filter(s => s.estado === 'Inactivo').length;
  const morosos = socios.filter(s => s.pago === 'Moroso').length;
  const alDia = socios.filter(s => s.pago === 'Al día').length;
  const recaudacion = socios.filter(s => s.pago === 'Al día').reduce((a, s) => a + (s.cuota || 0), 0);

  const cats = ['Titular', 'Adherente', 'Juvenil', 'Honorario'];
  const porCategoria = cats.map(c => ({ cat: c, count: socios.filter(s => s.categoria === c).length }));

  return { total, activos, inactivos, morosos, alDia, recaudacion, porCategoria };
}

let nextId = null;
export function getNextId(socios) {
  if (nextId === null) nextId = Math.max(0, ...socios.map(s => s.id)) + 1;
  return nextId++;
}
