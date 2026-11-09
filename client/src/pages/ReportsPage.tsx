
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  CalendarDays,
  ChartNoAxesCombined,
  Droplet,
  Heart,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

type Period = 'daily' | 'month-to-date' | 'monthly';

type Reading = {
  id: string;
  date: string;
  slot: string;
  value: number;
};

type Report = {
  highest: number | null;
  lowest: number | null;
  average: number | null;
  totalReadings: number;
  hasData: boolean;
  readings: Reading[];
  startDate?: string;
  endDate?: string;
};

const periods: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Daily report' },
  { value: 'month-to-date', label: 'Month to date' },
  { value: 'monthly', label: 'Previous month' },
];

const slotLabels: Record<string, string> = {
  MORNING: 'Morning (fasting)',
  AFTER_BREAKFAST: 'After breakfast',
  AFTER_LUNCH: 'After lunch',
  AFTER_DINNER: 'After dinner',
};

function todayString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

function formatDate(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00`)
    .toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
}

export default function ReportsPage() {
  const { user, logout } = useAuth();
  const [period, setPeriod] = useState<Period>('daily');
  const [date, setDate] = useState(todayString());
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/reports/${period}?date=${date}`);
      setReport(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load report.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [period, date]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const chartData = (report?.readings || []).map((reading) => ({
    ...reading,
    label: formatDate(reading.date),
  }));

  const periodLabel =
    period === 'daily'
      ? formatDate(date)
      : period === 'month-to-date'
        ? `${date.slice(0, 7)} month to date`
        : 'Previous calendar month';

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon"><Heart size={22} /></span>
          <span>Sweety</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <Link to="/" className="sidebar-link">
          <Activity size={19} /> Overview
        </Link>
        <Link to="/reports" className="sidebar-link active">
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
            <p className="eyebrow">YOUR HEALTH INSIGHTS</p>
            <h1>Glucose reports <span>📊</span></h1>
            <p className="header-subtitle">
              Understand your glucose patterns and track your progress.
            </p>
          </div>
        </header>

        <section className="panel report-filters">
          <div>
            <label htmlFor="report-period">Report period</label>
            <select
              id="report-period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              {periods.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="report-date">Reference date</label>
            <div className="date-control">
              <CalendarDays size={17} />
              <input
                id="report-date"
                type="date"
                value={date}
                max={todayString()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="report-period-caption">
          <TrendingUp size={17} />
          Showing: {periodLabel}
        </div>

        <section className="summary-grid">
          <article className="summary-card">
            <div className="summary-icon purple"><Activity /></div>
            <span>Average glucose</span>
            <strong>{report?.average ?? '--'} <small>mg/dL</small></strong>
            <p>Period average</p>
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
            <p>Recorded in this period</p>
          </article>
        </section>

        <section className="panel report-chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Glucose trend analysis</h2>
              <p>Your recorded blood glucose levels over time</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Generating your report...</div>
          ) : error ? (
            <div className="error-banner">{error}</div>
          ) : !report?.hasData ? (
            <div className="empty-state">
              <Droplet size={36} />
              <strong>No readings available</strong>
              <span>
                There are no glucose readings for this selected period.
                Add readings from the Overview page to see your report.
              </span>
              <Link to="/" className="primary-button report-overview-link">
                Go to overview
              </Link>
            </div>
          ) : (
            <div className="chart-area report-chart-area">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} mg/dL`, 'Glucose']}
                  />
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
        </section>

        <section className="panel report-history-panel">
          <div className="panel-heading">
            <div>
              <h2>Reading history</h2>
              <p>All readings included in this report</p>
            </div>
            <span className="report-count">
              {report?.totalReadings ?? 0} readings
            </span>
          </div>

          {loading ? (
            <div className="empty-state">Loading reading history...</div>
          ) : !report?.readings.length ? (
            <div className="empty-state">No reading history for this period.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time slot</th>
                    <th>Glucose level</th>
                  </tr>
                </thead>
                <tbody>
                  {report.readings.map((reading) => (
                    <tr key={reading.id}>
                      <td>{formatDate(reading.date)}</td>
                      <td>{slotLabels[reading.slot] || reading.slot}</td>
                      <td><strong>{reading.value} mg/dL</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
