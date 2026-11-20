'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, CartesianGrid, Legend, Area, AreaChart } from 'recharts'

const fmtINR = (n) => {
  if (!isFinite(n)) return '₹0'
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

const TOOLTIP = { background: 'rgb(var(--card))', color: 'rgb(var(--text))', border: '1px solid rgb(var(--border))', borderRadius: 12, fontSize: 12 }
const COLORS = ['rgb(var(--primary))', 'rgb(var(--text))', 'rgb(var(--highlight))', 'rgb(var(--muted))', 'rgb(var(--primary-hover))', 'rgb(var(--bg-secondary))']

export function BreakdownChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
          <XAxis dataKey="name" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtINR} width={70} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmtINR(v)} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>{data.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LeaksChart({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmtINR(v)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ProjectionChart({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cur" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0} /></linearGradient>
            <linearGradient id="opt" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#047857" stopOpacity={0.5} /><stop offset="100%" stopColor="#047857" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
          <XAxis dataKey="m" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtINR} width={70} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmtINR(v)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="current" name="Current path" stroke="rgb(var(--primary))" fill="url(#cur)" strokeWidth={2} />
          <Area type="monotone" dataKey="optimized" name="Engineered path" stroke="#047857" fill="url(#opt)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CompareChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
          <XAxis dataKey="name" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtINR} width={70} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmtINR(v)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="current" name="Current" fill="rgb(var(--primary))" radius={[8, 8, 0, 0]} />
          <Bar dataKey="optimized" name="Engineered" fill="#047857" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
