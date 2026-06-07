import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Check,
  Mail,
  Send,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Sparkles,
} from 'lucide-react';
import { getAllMatches, sendMatch } from '../services/matchService';

const LOGO_URL = 'https://wenqiubmwpwncxtaqfgz.supabase.co/storage/v1/object/public/images/thedatecrew_logo.jpg';

function formatBody(body) {
  if (!body) return "";
  return body
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin: 0 0 14px;">${line}</p>`)
    .join("");
}

function getEmailHtml(body) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin:0; padding:0; background:#FAFAF5; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF5; padding:32px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              <tr>
                <td style="padding:28px 32px; text-align:center; background:#fff7f2;">
                  <img src="${LOGO_URL}" alt="The Date Crew" width="120" style="display:block; margin:0 auto 14px;" />
                  <div style="font-size:13px; color:#9a6b55; letter-spacing:0.4px;">
                    Thoughtful introductions for serious relationships
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:34px 38px 20px;">
                  <h1 style="margin:0 0 18px; color:#2f1b14; font-size:24px; line-height:1.3;">
                    A thoughtful match curated for you
                  </h1>
                  <div style="font-size:15px; line-height:1.7; color:#4b3a34;">
                    ${formatBody(body)}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 38px 32px;">
                  <div style="background:#fff7f2; border:1px solid #f0d8cc; border-radius:14px; padding:18px;">
                    <p style="margin:0; color:#7c2d12; font-size:14px; line-height:1.6;">
                      This introduction was curated by your TDC matchmaker based on compatibility signals, preferences, and relationship goals.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 32px; text-align:center; background:#2f1b14;">
                  <p style="margin:0; color:#f8e7dc; font-size:13px;">
                    © The Date Crew
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

const CircularProgress = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="#E5E5E0"
        strokeWidth="5"
      />
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="#B5651D"
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text
        x="45"
        y="42"
        textAnchor="middle"
        className="text-xl font-bold fill-current"
        dominantBaseline="middle"
      >
        {score}%
      </text>
    </svg>
  );
};

const badgeStyles = {
  'Top Match': 'bg-green-100 text-green-700',
  'Strong Match': 'bg-amber-100 text-amber-700',
  'Good Match': 'bg-orange-50 text-orange-500',
};

function MatchCard({ match, onMatchSent, onOpenExplanation, onOpenEmailPreview }) {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { customer, suggestedCustomer, score, label, reasons, status } = match;
  const fullName = `${suggestedCustomer.firstName} ${suggestedCustomer.lastName}`;
  const targetName = customer ? `${customer.firstName} ${customer.lastName}` : 'Customer';

  const handleSendMatch = async () => {
    setIsSending(true);
    try {
      await sendMatch(match.id);
      onMatchSent(match.id);
      alert('Match sent successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send match.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/customers/${suggestedCustomer.id}`)}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex items-center gap-6 cursor-pointer"
    >
      {/* Circular Score */}
      <div className="flex flex-col items-center shrink-0">
        <CircularProgress score={score} />
        <span className="text-xs text-gray-500 mt-1 font-medium">
          Match Score
        </span>
      </div>

      {/* Customer Info */}
      <div className="flex flex-col gap-1.5 min-w-[200px] shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <img
            src={suggestedCustomer.photos?.[0] || 'https://randomuser.me/api/portraits/lego/1.jpg'}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <h3 className="font-semibold text-gray-800 text-base leading-tight">
              {fullName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {suggestedCustomer.age || 'Age N/A'}, {suggestedCustomer.city || 'Location N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {suggestedCustomer.designation || 'Profession N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[label] || 'bg-gray-100 text-gray-600'}`}
          >
            {label}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-600 border border-purple-100">
            For: {targetName}
          </span>
        </div>
      </div>

      {/* Top Reasons */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Top Reasons
        </h4>
        <ul className="space-y-1.5">
          {reasons?.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              {idx % 2 === 0 ? (
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <Star className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              )}
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div 
        className="flex flex-col items-end gap-2.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenExplanation(match)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-orange-200 text-orange-500 bg-white rounded-lg hover:bg-orange-50 transition-colors w-40 justify-center whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          AI Explanation
        </button>

        <button
          onClick={() => onOpenEmailPreview(match)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-blue-200 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors w-40 justify-center whitespace-nowrap"
        >
          <Mail className="w-4 h-4" />
          Email Preview
        </button>

        {status === 'SENT' ? (
          <button disabled className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-500 rounded-lg w-40 justify-center cursor-not-allowed whitespace-nowrap">
            <Check className="w-4 h-4" />
            Sent
          </button>
        ) : (
          <button
            onClick={handleSendMatch}
            disabled={isSending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245a42] transition-colors w-40 justify-center disabled:opacity-70 whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Send Match'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Matches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedEmailPreview, setSelectedEmailPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getAllMatches()
      .then((data) => {
        if (isMounted) {
          setMatches(data);
          setError('');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Unable to load matches.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMatchSent = (matchId) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'SENT' } : m));
  };

  const filteredMatches = matches.filter((match) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name =
      `${match.suggestedCustomer.firstName} ${match.suggestedCustomer.lastName}`.toLowerCase();
    const targetName = match.customer ? `${match.customer.firstName} ${match.customer.lastName}`.toLowerCase() : '';
    return (
      name.includes(q) ||
      targetName.includes(q) ||
      match.label.toLowerCase().includes(q) ||
      match.suggestedCustomer.city?.toLowerCase().includes(q)
    );
  }).sort((a, b) => b.score - a.score);

  const perPage = 10;
  const totalMatches = filteredMatches.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / perPage));

  const currentMatches = filteredMatches.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return [...new Set(pages)];
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading matches...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage generated matches
        </p>
      </div>

      {/* Top Bar: Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition-colors"
          />
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {currentMatches.map((match) => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onMatchSent={handleMatchSent} 
            onOpenExplanation={setSelectedMatch} 
            onOpenEmailPreview={setSelectedEmailPreview}
          />
        ))}

        {filteredMatches.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No matches found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredMatches.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, totalMatches)} of {totalMatches} matches
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[#2D6A4F] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Explanation Side Panel */}
      {selectedMatch && (
        <>
          <div 
            className="fixed inset-0 top-0 bg-gray-900/20 z-[30] backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedMatch(null)} 
          />
          <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-[40] pt-[65px] flex flex-col animate-slide-left border-l border-gray-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                AI Explanation
              </h2>
              <button 
                onClick={() => setSelectedMatch(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFAF5]">
              <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <img 
                  src={selectedMatch.suggestedCustomer.photos?.[0] || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-50" 
                  alt="Customer"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {selectedMatch.suggestedCustomer.firstName} {selectedMatch.suggestedCustomer.lastName}
                  </h3>
                  <span className="text-green-600 font-semibold text-sm">{selectedMatch.score}% Match</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 text-base">Why this is a strong match</h4>
                <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedMatch.aiExplanation || "The AI is still processing the compatibility insights for this pair. Please check back shortly."}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Email Preview Side Panel */}
      {selectedEmailPreview && (
        <>
          <div 
            className="fixed inset-0 top-0 bg-gray-900/20 z-[30] backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedEmailPreview(null)} 
          />
          <div className="fixed top-0 right-0 h-full w-[700px] bg-white shadow-2xl z-[40] pt-[65px] flex flex-col animate-slide-left border-l border-gray-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Preview
              </h2>
              <button 
                onClick={() => setSelectedEmailPreview(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 bg-[#FAFAF5] overflow-hidden flex flex-col">
              <div className="bg-white px-6 py-4 border-b border-gray-100 shadow-sm shrink-0 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">To:</span> {selectedEmailPreview.customer?.firstName} {selectedEmailPreview.customer?.lastName} &lt;{selectedEmailPreview.customer?.email}&gt;
                </div>
                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  Subject: A thoughtful introduction from The Date Crew
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden w-full relative bg-[#FAFAF5]">
                {selectedEmailPreview.introEmail ? (
                  <iframe 
                    title="Email Preview"
                    className="absolute inset-0 w-full h-full border-0"
                    srcDoc={getEmailHtml(selectedEmailPreview.introEmail)}
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500">No email preview available.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
