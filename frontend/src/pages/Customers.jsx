import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { getCustomers } from '../services/customerService';

const ROWS_PER_PAGE = 10;

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getAge(dateOfBirth) {
  if (!dateOfBirth) return '—';
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return '—';
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

function StatusBadge({ status }) {
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
}

export default function Customers() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getCustomers()
      .then((data) => {
        if (isMounted) {
          setCustomers(data);
          setError('');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load customers.');
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

  const statusCounts = useMemo(() => {
    const verified = customers.filter((c) => c.statusTag === 'VERIFIED').length;
    const unverified = customers.filter((c) => c.statusTag === 'NEW').length;

    return {
      all: customers.length,
      verified,
      pending: customers.length - verified - unverified,
      unverified,
    };
  }, [customers]);

  const tabs = useMemo(
    () => [
      { key: 'all', label: 'All', count: statusCounts.all },
      { key: 'verified', label: 'Verified', count: statusCounts.verified },
      { key: 'pending', label: 'Pending', count: statusCounts.pending },
      { key: 'unverified', label: 'Unverified', count: statusCounts.unverified },
    ],
    [statusCounts]
  );

  // Filter customers based on active tab and search
  const filteredCustomers = useMemo(() => {
    let list = customers;

    // Tab filter
    if (activeTab === 'verified') {
      list = list.filter((c) => c.statusTag === 'VERIFIED');
    } else if (activeTab === 'pending') {
      list = list.filter(
        (c) => c.statusTag !== 'VERIFIED' && c.statusTag !== 'NEW'
      );
    } else if (activeTab === 'unverified') {
      list = list.filter((c) => c.statusTag === 'NEW');
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q) ||
          c.country?.toLowerCase().includes(q) ||
          c.designation?.toLowerCase().includes(q)
      );
    }

    // Gender Filter
    if (genderFilter !== 'ALL') {
      list = list.filter((c) => c.gender === genderFilter);
    }

    return list;
  }, [activeTab, customers, searchQuery, genderFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ROWS_PER_PAGE));
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const displayTotalPages = totalPages;

  function handleTabChange(key) {
    setActiveTab(key);
    setCurrentPage(1);
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  // Build page numbers to render
  function getPageNumbers() {
    const pages = [];
    if (displayTotalPages <= 7) {
      for (let i = 1; i <= displayTotalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < displayTotalPages - 2) {
        pages.push(currentPage);
      }
      if (currentPage < displayTotalPages - 3) pages.push('...');
      pages.push(displayTotalPages);
    }
    // Deduplicate
    const unique = [];
    for (const p of pages) {
      if (unique[unique.length - 1] !== p) unique.push(p);
    }
    return unique;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all your customers
        </p>
      </div>

      {/* Top Bar: Search, Filters, Add Button */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </div>

          {/* Filters Button */}
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {genderFilter !== 'ALL' && (
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] ml-1"></span>
              )}
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gender</h3>
                <div className="space-y-1">
                  {['ALL', 'MALE', 'FEMALE'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-50 p-1.5 rounded">
                      <input 
                        type="radio" 
                        name="gender" 
                        value={g}
                        checked={genderFilter === g}
                        onChange={(e) => {
                          setGenderFilter(e.target.value);
                          setFilterOpen(false);
                          setCurrentPage(1);
                        }}
                        className="text-[#2D6A4F] focus:ring-[#2D6A4F]"
                      />
                      {g === 'ALL' ? 'Any' : g.charAt(0) + g.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="mb-5 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'text-[#2D6A4F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                activeTab === tab.key
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab.count}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2D6A4F]" />
            )}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Profession
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Intent
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Added On
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              )}

              {error && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="group transition-colors hover:bg-[#FDF6EC]/50"
                >
                  {/* Customer: avatar + name + age/gender */}
                  <td className="px-5 py-4">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={getPhoto(customer)}
                        alt={`${customer.firstName} ${customer.lastName}`}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getAge(customer.dateOfBirth)} &bull; {customer.gender === 'MALE' ? 'Male' : 'Female'}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-gray-600">
                    {[customer.city, customer.country].filter(Boolean).join(', ') || '—'}
                  </td>

                  {/* Profession */}
                  <td className="px-5 py-4 text-gray-600">
                    {customer.designation || '—'}
                  </td>

                  {/* Intent */}
                  <td className="px-5 py-4 text-gray-600">Marriage</td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={customer.statusTag} />
                  </td>

                  {/* Added On */}
                  <td className="px-5 py-4 text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>


                </tr>
              ))}

              {!isLoading && !error && paginatedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-500">
            Showing{' '}
            <span className="font-medium text-gray-700">
              {filteredCustomers.length === 0
                ? 0
                : (currentPage - 1) * ROWS_PER_PAGE + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-gray-700">
              {Math.min(currentPage * ROWS_PER_PAGE, filteredCustomers.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-700">
              {statusCounts[activeTab] || filteredCustomers.length}
            </span>{' '}
            customers
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(displayTotalPages, p + 1))
              }
              disabled={currentPage === displayTotalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
