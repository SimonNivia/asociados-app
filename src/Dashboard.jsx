import { useEffect, useRef } from 'react';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getStats } from './store.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function MetricCard({ label, value, cls = '' }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${cls}`}>{value}</div>
    </div>
  );
}

function DonutChart({ id, data, colors, labels }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    if (!ref.current) return;
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`
        }}}
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [JSON.stringify(data)]);

  return <canvas ref={ref} role="img" aria-label={`Gráfico ${id}`} />;
}

function BarChart({ data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    if (!ref.current) return;
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: data.map(d => d.cat),
        datasets: [{
          label: 'Socios',
          data: data.map(d => d.count),
          backgroundColor: ['#185FA5', '#639922', '#BA7517', '#5F5E5A'],
          borderRadius: 5, borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 12 } } },
          y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { stepSize: 1, font: { size: 12 } } }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [JSON.stringify(data)]);

  return <canvas ref={ref} role="img" aria-label="Socios por categoría" />;
}

export default function Dashboard({ socios }) {
  const stats = getStats(socios);

  return (
    <div className="content">
      <div className="metrics">
        <MetricCard label="Total socios" value={stats.total} cls="blue" />
        <MetricCard label="Activos" value={stats.activos} cls="green" />
        <MetricCard label="Inactivos" value={stats.inactivos} cls="gray" />
        <MetricCard label="Morosos" value={stats.morosos} cls="red" />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Estado de membresía</div>
          <div className="chart-sub">Activos vs inactivos</div>
          <div className="legend">
            <div className="leg-item"><div className="leg-dot" style={{ background: '#639922' }} />Activos ({stats.activos})</div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#888780' }} />Inactivos ({stats.inactivos})</div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 180 }}>
            <DonutChart id="estado" data={[stats.activos, stats.inactivos]} colors={['#639922', '#888780']} labels={['Activos', 'Inactivos']} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Estado de cuotas</div>
          <div className="chart-sub">Al día vs morosos</div>
          <div className="legend">
            <div className="leg-item"><div className="leg-dot" style={{ background: '#378ADD' }} />Al día ({stats.alDia})</div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#E24B4A' }} />Morosos ({stats.morosos})</div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 180 }}>
            <DonutChart id="cuotas" data={[stats.alDia, stats.morosos]} colors={['#378ADD', '#E24B4A']} labels={['Al día', 'Morosos']} />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: 12 }}>
        <div className="chart-title">Distribución por categoría</div>
        <div className="chart-sub" style={{ marginBottom: 10 }}>Cantidad de socios por tipo de membresía</div>
        <div style={{ position: 'relative', width: '100%', height: 180 }}>
          <BarChart data={stats.porCategoria} />
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Recaudación mensual estimada</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
          ${stats.recaudacion.toLocaleString('es-AR')}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 2 }}>Socios al día únicamente</div>
      </div>
    </div>
  );
}
