import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, CircleDot, FileText, KeyRound, LayoutDashboard, Radio, Search, ShieldCheck } from 'lucide-react';

const API = 'http://localhost:8000/api';
const fallbackAlerts = [
  { alert_id: 'AL-DEMO01', threat_type: 'Brute Force Attack', ip: '192.168.1.50', severity: 'CRITICAL', risk_score: 91, status: 'OPEN', timestamp: '2026-08-19T18:30:30', evidence: ['5 failed login attempts in 60 seconds'] },
  { alert_id: 'AL-DEMO02', threat_type: 'Suspicious Source IP', ip: '10.10.10.10', severity: 'HIGH', risk_score: 85, status: 'INVESTIGATING', timestamp: '2026-08-19T18:28:12', evidence: ['Matched local watchlist'] },
  { alert_id: 'AL-DEMO03', threat_type: 'Port Scan', ip: '172.16.4.10', severity: 'MEDIUM', risk_score: 55, status: 'OPEN', timestamp: '2026-08-19T18:22:08', evidence: ['18 destination ports in 30 seconds'] },
];

function App() {
  const [summary, setSummary] = useState({ total_logs: 0, total_alerts: 0, critical_alerts: 0, open_incidents: 0 });
  const [alerts, setAlerts] = useState(fallbackAlerts);
  const [logs, setLogs] = useState([]);
  const [view, setView] = useState('Dashboard');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, alertsResponse, logsResponse] = await Promise.all([fetch(`${API}/summary`), fetch(`${API}/alerts`), fetch(`${API}/logs`)]);
        if (summaryResponse.ok) setSummary(await summaryResponse.json());
        if (alertsResponse.ok) setAlerts(await alertsResponse.json());
        if (logsResponse.ok) setLogs(await logsResponse.json());
      } catch { /* The demo remains useful while the API is starting. */ }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleAlerts = alerts.filter((alert) => `${alert.threat_type} ${alert.ip} ${alert.severity}`.toLowerCase().includes(query.toLowerCase()));
  const navItems = [['Dashboard', LayoutDashboard], ['Alerts', AlertTriangle], ['Logs', FileText], ['Login Lab', KeyRound], ['Incidents', ShieldCheck], ['Analytics', Activity]];

  if (view === 'Logs') return <LogsView logs={logs} alerts={alerts} query={query} setQuery={setQuery} navItems={navItems} summary={summary} setView={setView} />;
  if (view === 'Login Lab') return <LoginLab navItems={navItems} summary={summary} setView={setView} />;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Radio size={18} /></span><div><strong>ARGUS</strong><small>AI SOC ASSISTANT</small></div></div>
      <div className="workspace-label">WORKSPACE / PRIMARY</div>
      <nav>{navItems.map(([label, Icon]) => <button className={view === label ? 'nav-item active' : 'nav-item'} onClick={() => setView(label)} key={label}><Icon size={17} />{label}{label === 'Alerts' && summary.total_alerts > 0 && <span className="nav-count">{summary.total_alerts}</span>}</button>)}</nav>
      <div className="sidebar-footer"><div className="pulse"><CircleDot size={14} /> SYSTEM ONLINE</div><span>Polling API every 5s</span></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><p className="eyebrow">SECURITY OPERATIONS CENTER / {view.toUpperCase()}</p><h1>{view === 'Dashboard' ? 'Threat command center' : view}</h1></div><div className="topbar-meta"><span className="live-dot" /> LIVE MONITORING <button className="analyst">AJ <span>Analyst</span></button></div></header>
      <section className="content">
        <div className="section-heading"><div><p className="eyebrow">{view === 'Dashboard' ? 'LAST 24 HOURS' : 'ACTIVE QUEUE'}</p><h2>{view === 'Dashboard' ? 'Detection overview' : `${view} queue`}</h2></div><div className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter alerts" /></div></div>
        <div className="metrics"><Metric label="Total logs" value={summary.total_logs.toLocaleString()} note="Ingested events" icon={FileText} /><Metric label="Total alerts" value={summary.total_alerts.toLocaleString()} note="Rules triggered" icon={AlertTriangle} tone="amber" /><Metric label="Critical alerts" value={summary.critical_alerts.toLocaleString()} note="Needs attention" icon={Activity} tone="red" /><Metric label="Open incidents" value={summary.open_incidents.toLocaleString()} note="Across workspace" icon={ShieldCheck} tone="blue" /></div>
        <div className="grid-main"><section className="panel timeline-panel"><div className="panel-header"><div><p className="eyebrow">SIGNAL VOLUME</p><h3>Threat activity</h3></div><span className="panel-period">24H <ArrowUpRight size={15} /></span></div><div className="chart"><div className="chart-y"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="chart-body"><div className="grid-lines" /><svg viewBox="0 0 700 220" preserveAspectRatio="none"><path className="area" d="M0,190 C55,180 65,188 105,165 S165,178 205,130 S255,154 300,142 S360,145 390,105 S450,146 500,90 S540,128 580,70 S630,102 700,30 L700,220 L0,220Z" /><path className="line" d="M0,190 C55,180 65,188 105,165 S165,178 205,130 S255,154 300,142 S360,145 390,105 S450,146 500,90 S540,128 580,70 S630,102 700,30" /></svg><div className="chart-labels"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>NOW</span></div></div></div></section><section className="panel distribution"><div className="panel-header"><div><p className="eyebrow">RISK ENGINE</p><h3>Severity distribution</h3></div></div><div className="donut-wrap"><div className="donut"><strong>{summary.total_alerts}</strong><span>alerts</span></div><div className="legend"><Legend label="Critical" value={summary.critical_alerts} color="red" /><Legend label="High" value={Math.max(0, summary.total_alerts - summary.critical_alerts)} color="amber" /><Legend label="Medium" value="—" color="blue" /></div></div></section></div>
        <section className="panel alerts-panel"><div className="panel-header"><div><p className="eyebrow">DETECTION ENGINE OUTPUT</p><h3>Recent alerts</h3></div><button className="text-button" onClick={() => setView('Alerts')}>View all <ArrowUpRight size={15} /></button></div><div className="alert-table"><div className="table-head"><span>Alert</span><span>Source IP</span><span>Severity</span><span>Risk</span><span>Status</span></div>{visibleAlerts.slice(0, 5).map((alert) => <div className="table-row" key={alert.alert_id}><div><strong>{alert.threat_type}</strong><small>{alert.alert_id} · {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div><code>{alert.ip}</code><span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span><strong className="risk">{alert.risk_score}<small>/100</small></strong><span className="status"><i />{alert.status}</span></div>)}{visibleAlerts.length === 0 && <div className="empty">No alerts match this filter.</div>}</div></section>
      </section>
    </main>
  </div>;
}

function Metric({ label, value, note, icon: Icon, tone = 'green' }) { return <div className="metric"><div className={`metric-icon ${tone}`}><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>; }
function Legend({ label, value, color }) { return <div><i className={color} /><span>{label}</span><strong>{value}</strong></div>; }

function LogsView({ logs, alerts, query, setQuery, navItems, summary, setView }) {
  const visibleLogs = logs.filter((log) => `${log.ip} ${log.username ?? ''} ${log.event_type} ${log.status}`.toLowerCase().includes(query.toLowerCase()));
  const threatIps = new Set(alerts.map((alert) => alert.ip));
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><Radio size={18} /></span><div><strong>ARGUS</strong><small>AI SOC ASSISTANT</small></div></div><div className="workspace-label">WORKSPACE / PRIMARY</div><nav>{navItems.map(([label, Icon]) => <button className={label === 'Logs' ? 'nav-item active' : 'nav-item'} onClick={() => setView(label)} key={label}><Icon size={17} />{label}{label === 'Alerts' && summary.total_alerts > 0 && <span className="nav-count">{summary.total_alerts}</span>}</button>)}</nav><div className="sidebar-footer"><div className="pulse"><CircleDot size={14} /> SYSTEM ONLINE</div><span>Polling API every 5s</span></div></aside>
    <main className="main-content"><header className="topbar"><div><p className="eyebrow">SECURITY OPERATIONS CENTER / LOGS</p><h1>Event observatory</h1></div><div className="topbar-meta"><span className="live-dot" /> LIVE MONITORING <button className="analyst">AJ <span>Analyst</span></button></div></header><section className="content logs-content"><div className="section-heading"><div><p className="eyebrow">RAW SECURITY TELEMETRY</p><h2>Login activity</h2><p className="section-description">Trace every authentication event and see which sources crossed a detection rule.</p></div><div className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search IP, user, event" /></div></div><div className="log-summary"><div><strong>{logs.length}</strong><span>events received</span></div><div><strong>{logs.filter((log) => log.event_type === 'login').length}</strong><span>login attempts</span></div><div><strong>{new Set(logs.filter((log) => log.status === 'failed').map((log) => log.ip)).size}</strong><span>sources with failures</span></div><div><strong>{threatIps.size}</strong><span>IPs with threats</span></div></div><section className="panel logs-panel"><div className="panel-header"><div><p className="eyebrow">INGESTION STREAM</p><h3>Authentication events</h3></div><span className="stream-status"><i /> STREAMING</span></div><div className="logs-table"><div className="logs-head"><span>Timestamp</span><span>Source IP</span><span>Account</span><span>Event</span><span>Result</span><span>Threat activity</span></div>{visibleLogs.map((log, index) => { const isThreat = threatIps.has(log.ip); return <div className="logs-row" key={`${log.timestamp}-${log.ip}-${index}`}><code>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</code><code>{log.ip}</code><strong>{log.username || 'unknown'}</strong><span className="event-type">{log.event_type}</span><span className={`result ${log.status.toLowerCase()}`}><i />{log.status}</span><span className={isThreat ? 'threat-flag' : 'clean-flag'}>{isThreat ? <><AlertTriangle size={13} /> DETECTED</> : <><ShieldCheck size={13} /> NORMAL</>}</span></div>; })}{visibleLogs.length === 0 && <div className="empty">No ingested logs match this filter.</div>}</div></section></section></main>
  </div>;
}

function LoginLab({ navItems, summary, setView }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('wrong-password');
  const [sourceIp, setSourceIp] = useState('192.168.1.50');
  const [message, setMessage] = useState('Ready to test a monitored login.');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API}/demo/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, source_ip: sourceIp }) });
      const result = await response.json();
      setAttempts((value) => value + 1);
      setMessage(result.alerts?.length ? `Login failed. Detection engine raised: ${result.alerts.map((alert) => alert.threat_type).join(', ')}.` : result.message);
    } catch {
      setMessage('The SOC API is offline. Start the backend and try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><Radio size={18} /></span><div><strong>ARGUS</strong><small>AI SOC ASSISTANT</small></div></div><div className="workspace-label">WORKSPACE / PRIMARY</div><nav>{navItems.map(([label, Icon]) => <button className={label === 'Login Lab' ? 'nav-item active' : 'nav-item'} onClick={() => setView(label)} key={label}><Icon size={17} />{label}{label === 'Alerts' && summary.total_alerts > 0 && <span className="nav-count">{summary.total_alerts}</span>}</button>)}</nav><div className="sidebar-footer"><div className="pulse"><CircleDot size={14} /> SYSTEM ONLINE</div><span>Polling API every 5s</span></div></aside><main className="main-content"><header className="topbar"><div><p className="eyebrow">SECURITY OPERATIONS CENTER / LOGIN LAB</p><h1>Monitored access point</h1></div><div className="topbar-meta"><span className="live-dot" /> LIVE MONITORING <button className="analyst">AJ <span>Analyst</span></button></div></header><section className="content login-content"><div className="section-heading"><div><p className="eyebrow">DEMO AUTHENTICATION FLOW</p><h2>Try a login</h2><p className="section-description">Each failed attempt is sent to the ingestion API and examined by the detection engine in real time.</p></div><div className="attempt-counter"><strong>{attempts}</strong><span>this session</span></div></div><div className="login-grid"><section className="panel login-card"><div className="login-card-heading"><span className="login-icon"><KeyRound size={21} /></span><div><p className="eyebrow">LINUX / SSH GATEWAY</p><h3>Authentication required</h3></div></div><form onSubmit={submitLogin}><label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label><label>Source IP<input value={sourceIp} onChange={(event) => setSourceIp(event.target.value)} /></label><button className="login-submit" type="submit" disabled={loading}>{loading ? 'Examining...' : 'Attempt login'} <ArrowUpRight size={16} /></button></form><div className="login-message"><span className="live-dot" />{message}</div></section><section className="panel flow-card"><p className="eyebrow">WHAT HAPPENS NEXT</p><h3>Every attempt is evidence</h3><div className="flow-step"><span>01</span><div><strong>Credential check</strong><small>The demo rejects the credentials safely.</small></div></div><div className="flow-step"><span>02</span><div><strong>Log ingestion</strong><small>A failed login is stored with IP and account.</small></div></div><div className="flow-step"><span>03</span><div><strong>Rule examination</strong><small>Five failures in 60 seconds become brute force.</small></div></div><div className="flow-step final"><span>04</span><div><strong>Alert appears</strong><small>Risk, severity, and evidence reach the dashboard.</small></div></div></section></div></section></main></div>;
}

export default App;
