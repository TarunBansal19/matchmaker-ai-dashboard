import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Star, Send, Plus, ChevronUp, ArrowRight } from 'lucide-react';
import { getStoredMatchmaker } from '../services/authService';
import { getCustomers } from '../services/customerService';
import { getDashboardStats } from '../services/dashboardService';

function getAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function getPhoto(customer) {
  return customer.photos?.[0] || 'https://randomuser.me/api/portraits/lego/1.jpg';
}

function MiniLineChart({ data }) {
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 24;
  const values = data.map((item) => item.matches);
  const min = 0;
  const max = Math.max(...values, 4);
  const range = max - min || 1;
  const step = (width - paddingX * 2) / Math.max(1, data.length - 1);
  const points = data.map((item, index) => {
    const x = paddingX + index * step;
    const y = height - paddingY - ((item.matches - min) / range) * (height - paddingY * 2);
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="h-[280px] w-full bg-gradient-to-br from-[#FAFAF5] to-[#F3F4F0] rounded-xl p-4 border border-gray-100/50 shadow-inner">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2D6A4F" />
            <stop offset="100%" stopColor="#40916C" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y Axis Label */}
        <text x={10} y={15} textAnchor="start" className="fill-gray-500 text-[11px] font-semibold tracking-wider uppercase">
          Matches Generated
        </text>

        {/* Grid Lines & Y Axis Values */}
        {[0, 1, 2, 3].map((line) => {
          const y = paddingY + line * ((height - paddingY * 2) / 3);
          const val = Math.round(max - line * (range / 3));
          return (
            <g key={line}>
              <text x={paddingX - 8} y={y + 4} textAnchor="end" className="fill-gray-400 text-[11px] font-medium">{val}</text>
              <line x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="#E5E7EB" strokeDasharray="4 4" />
            </g>
          );
        })}
        <path d={areaPath} fill="url(#areaGradient)" />
        <path d={path} fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
        {points.map((point) => (
          <g key={point.date || point.name}>
            <circle cx={point.x} cy={point.y} r="6" fill="#fff" stroke="#2D6A4F" strokeWidth="3" className="drop-shadow-md transition-all hover:r-8" />
            <text x={point.x} y={height - 2} textAnchor="middle" className="fill-gray-500 text-[12px] font-medium">
              {point.date || point.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const statusBadge = (status) => {
  const normalized = status?.toUpperCase();
  switch (normalized) {
    case 'NEW':
      return <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">New</span>;
    case 'VERIFIED':
      return <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">Verified</span>;
    case 'IN_REVIEW':
      return <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">In Review</span>;
    case 'MATCHES_READY':
      return <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-200">Matches Ready</span>;
    case 'MATCH_SENT':
      return <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">Match Sent</span>;
    case 'ON_HOLD':
      return <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">On Hold</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">Pending</span>;
  }
};

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const matchmaker = getStoredMatchmaker();
  const userName = matchmaker?.name || 'Matchmaker';

  useEffect(() => {
    let isMounted = true;

    Promise.all([getCustomers(), getDashboardStats()])
      .then(([customersData, statsData]) => {
        if (isMounted) {
          setCustomers(customersData);
          setStats(statsData);
          setError('');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load dashboard data.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    return [
      {
        value: stats?.totalCustomers || 0,
        trend: stats?.totalCustomers || 0,
        label: 'Total Customers',
        icon: Users,
        iconBg: 'bg-[#F5F0E6]',
        iconColor: 'text-[#B5651D]',
      },
      {
        value: stats?.pendingProfiles || 0,
        trend: stats?.pendingProfiles || 0,
        label: 'Pending Profiles',
        icon: Heart,
        iconBg: 'bg-red-50',
        iconColor: 'text-red-500',
      },
      {
        value: stats?.verifiedProfiles || 0,
        trend: stats?.verifiedProfiles || 0,
        label: 'Verified Customers',
        icon: Star,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
      },
      {
        value: stats?.matchesSent || 0,
        trend: stats?.matchesSent || 0,
        label: 'Matches Sent',
        icon: Send,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-[#2D6A4F]',
      },
    ];
  }, [stats]);

  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s your matchmaking overview for today.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-full ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-emerald-600">
                <ChevronUp className="w-4 h-4" />
                <span className="font-medium">
                  {card.trend} this month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Customers
            </h2>
            <Link
              to="/customers"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F] hover:text-[#245a42] transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading && (
              <div className="px-6 py-8 text-sm text-gray-500">Loading customers...</div>
            )}
            {error && !isLoading && (
              <div className="px-6 py-8 text-sm text-red-600">{error}</div>
            )}
            {recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAF5] transition-colors"
              >
                <img
                  src={getPhoto(customer)}
                  alt={`${customer.firstName} ${customer.lastName}`}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {getAge(customer.dateOfBirth) || 'Age not set'}, {customer.city || customer.country || 'Location not set'}
                  </p>
                </div>
                <p className="hidden sm:block text-sm text-gray-500 truncate max-w-[120px]">
                  {customer.designation || 'Profession not set'}
                </p>
                {statusBadge(customer.statusTag)}
              </div>
            ))}
            {!isLoading && !error && recentCustomers.length === 0 && (
              <div className="px-6 py-8 text-sm text-gray-500">No customers found.</div>
            )}
          </div>
        </div>

        {/* Matches Overview Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Matches Overview
            </h2>
          </div>
          <div className="px-6 pt-6 pb-2 flex items-center justify-center">
            {stats && stats.chartData ? (
              <MiniLineChart data={stats.chartData} />
            ) : (
              <div className="h-[260px] flex items-center text-gray-500">Loading graph...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
