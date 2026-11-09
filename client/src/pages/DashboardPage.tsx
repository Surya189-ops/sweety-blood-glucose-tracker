import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, CalendarDays, ChartNoAxesCombined, Droplet,
  LogOut, Plus, Pencil, Trash2, X, Heart,
} from 'lucide-react';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

type Slot = 'MORNING' | 'AFTER_BREAKFAST' | 'AFTER_LUNCH' | 'AFTER_DINNER';

type Reading = {
  id: string;
  date: string;
  slot: Slot;
  value: number;
};

type Report = {
  highest: number | null;
  lowest: number | null;
  average: number | null;
  totalReadings: number;
  hasData: boolean;
  readings: Reading[];
};

const slots: { value: Slot; label: string }[] = [
  { value: 'MORNING', label: 'Morning (fasting)' },
  { value: 'AFTER_BREAKFAST', label: 'After breakfast' },
  { value: 'AFTER_LUNCH', label: 'After lunch' },
  { value: 'AFTER_DINNER', label: 'After dinner' },
];

function todayString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [date, setDate] = useState(todayString());
  const [period, setPeriod] = useState('daily');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reading | null>(null);
  const [formDate, setFormDate] = useState(todayString());
  const [formSlot, setFormSlot] = useState<Slot>('MORNING');
  const [formValue, setFormValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/reports/${period}?date=${date}`);
      setReport(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load readings.');
    } finally {
      setLoading(false);
    }
  }, [period, date]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  function openAdd() {
    setEditing(null);
    setFormDate(date);
    setFormSlot('MORNING');
    setFormValue('');
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(reading: Reading) {
    setEditing(reading);
    setFormDate(reading.date.slice(0, 10));
    setFormSlot(reading.slot);
    setFormValue(String(reading.value));
    setFormError('');
    setModalOpen(true);
  }

  async function saveReading(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      date: formDate,
      slot: formSlot,
      value: Number(formValue),
    };

    try {
      if (editing) {
        await api.put(`/readings/${editing.id}`, payload);
      } else {
        await api.post('/readings', payload);
      }

      setModalOpen(false);
      await loadReport();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Unable to save reading.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteReading(id: string) {
    if (!window.confirm('Are you sure you want to delete this reading?')) return;

    try {
      await api.delete(`/readings/${id}`);
      await loadReport();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to delete reading.');
    }
  }

  const chartData = (report?.readings || []).map((reading) => ({
    ...reading,
    label: new Date(`${reading.date.slice(0, 10)}T00:00:00`).toLocaleDateString(
      'en-IN',
      { day: 'numeric', month: 'short' },
    ),
  }));

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon"><Heart size={22} /></span>
          <span>Sweety</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <Link to="/" className="sidebar-link active">
          <Activity size={19} /> Overview
        </Link>
        <Link to="/reports" className="sidebar-link">
          <ChartNoAxesCombined size={19} /> Glucose reports
        </Link>

        <div className="sidebar-bottom">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="icon-button" onClick={logout} title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">YOUR HEALTH OVERVIEW</p>
            <h1>Good day, {user?.name?.split(' ')[0]} <span>👋</span></h1>
            <p className="header-subtitle">Keep track of your glucose, one day at a time.</p>
          </div>
          <button className="primary-button" onClick={openAdd}>
            <Plus size={18} /> Add reading
          </button>
        </header>

        <section className="summary-grid">
          <article className="summary-card">
            <div className="summary-icon purple"><Activity /></div>
            <span>Average glucose</span>
            <strong>{report?.average ?? '--'} <small>mg/dL</small></strong>
            <p>For selected period</p>
          </article>
          <article className="summary-card">
            <div className="summary-icon orange"><ChartNoAxesCombined /></div>
            <span>Highest reading</span>
            <strong>{report?.highest ?? '--'} <small>mg/dL</small></strong>
            <p>Peak glucose level</p>
          </article>
          <article className="summary-card">
            <div className="summary-icon green"><Droplet /></div>
            <span>Lowest reading</span>
            <strong>{report?.lowest ?? '--'} <small>mg/dL</small></strong>
            <p>Lowest glucose level</p>
          </article>
          <article className="summary-card">
            <div className="summary-icon blue"><CalendarDays /></div>
            <span>Total readings</span>
            <strong>{report?.totalReadings ?? 0}</strong>
            <p>Logged in this period</p>
          </article>
        </section>
        <section className="content-grid">
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h2>Glucose trends</h2>
                <p>Track your readings over time</p>
              </div>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="month-to-date">Month to date</option>
                <option value="monthly">Previous month</option>
              </select>
            </div>

            <div className="date-control">
              <CalendarDays size={17} />
              <input
                type="date"
                value={date}
                max={todayString()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="empty-state">Loading your glucose data...</div>
            ) : error ? (
              <div className="error-banner">{error}</div>
            ) : chartData.length === 0 ? (
              <div className="empty-state">
                <Droplet size={34} />
                <strong>No readings yet</strong>
                <span>Add your first glucose reading to see your trends.</span>
              </div>
            ) : (
              <div className="chart-area">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Glucose"
                      stroke="#8065d8"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#8065d8' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="panel readings-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent readings</h2>
                <p>Your glucose log for this period</p>
              </div>
              <button className="text-button" onClick={openAdd}>
                <Plus size={16} /> Add new
              </button>
            </div>

            {loading ? (
              <div className="empty-state">Loading readings...</div>
            ) : !report?.readings.length ? (
              <div className="empty-state">
                <Droplet size={30} />
                <strong>No readings recorded</strong>
                <span>Your readings will appear here.</span>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time slot</th>
                      <th>Glucose</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.readings.map((reading) => (
                      <tr key={reading.id}>
                        <td>
                          {new Date(`${reading.date.slice(0, 10)}T00:00:00`)
                            .toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          {slots.find((slot) => slot.value === reading.slot)?.label}
                        </td>
                        <td><strong>{reading.value} mg/dL</strong></td>
                        <td className="row-actions">
                          <button onClick={() => openEdit(reading)} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteReading(reading.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="reading-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <h2>{editing ? 'Edit reading' : 'Add glucose reading'}</h2>
                <p>Record your blood glucose level.</p>
              </div>
              <button className="icon-button" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveReading}>
              <label>
                Date
                <input
                  type="date"
                  value={formDate}
                  max={todayString()}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </label>

              <label>
                Time slot
                <select
                  value={formSlot}
                  onChange={(e) => setFormSlot(e.target.value as Slot)}
                  required
                >
                  {slots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Glucose value (mg/dL)
                <input
                  type="number"
                  min="40"
                  max="600"
                  step="1"
                  placeholder="e.g. 110"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  required
                />
              </label>

              {formError && <div className="error-banner">{formError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Save changes' : 'Add reading'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
