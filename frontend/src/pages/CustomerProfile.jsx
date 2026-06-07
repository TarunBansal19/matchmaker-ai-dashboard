import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById } from '../services/customerService';
import { createNote } from '../services/noteService';
import { generateMatchesForCustomer } from '../services/matchService';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Edit,
  MoreVertical,
  Plus,
  Sparkles,
  User,
} from 'lucide-react';

const TABS = ['About', 'Preferences', 'Lifestyle', 'Family', 'Notes'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

function genderLabel(g) {
  if (g === 'FEMALE') return 'Female';
  if (g === 'MALE') return 'Male';
  return g;
}

function maritalLabel(s) {
  if (s === 'SINGLE') return 'Never Married';
  if (s === 'DIVORCED') return 'Divorced';
  if (s === 'WIDOWED') return 'Widowed';
  return s;
}

// ─── About Tab ──────────────────────────────────────────────
function AboutTab({ customer, onAddNote }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <dl className="space-y-3 text-sm">
          {[
            ['Height', customer.heightCm ? `${customer.heightCm} cm` : '—'],
            ['Education', [customer.degree, customer.college].filter(Boolean).join(' from ') || '—'],
            ['Income', customer.incomeLpa ? `${customer.incomeLpa} LPA` : '—'],
            ['Languages', customer.languagesKnown?.join(', ') || '—'],
            ['Diet', customer.diet || '—'],
            ['Lives In', [customer.city, customer.state || customer.country].filter(Boolean).join(', ') || '—'],
            ['Open To Relocate', customer.openToRelocate === 'YES' ? 'Yes' : customer.openToRelocate === 'NO' ? 'No' : 'Maybe'],
            ['Open To Pets', customer.openToPets === 'YES' ? 'Yes' : customer.openToPets === 'NO' ? 'No' : 'Maybe'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <dt className="text-gray-500">{label}</dt>
              <dd className="text-gray-900 font-medium text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* About Bio + Personality */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          About {customer.firstName}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{customer.bio || 'No bio added yet.'}</p>
        <div className="flex flex-wrap gap-2">
          {customer.values?.map((v) => (
            <span
              key={v}
              className="px-3 py-1.5 text-xs font-medium text-[#B5651D] border border-dashed border-[#D4A373] rounded-full bg-[#FDF6EC]"
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Matchmaker Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Matchmaker Notes</h3>
          <button onClick={onAddNote} className="flex items-center gap-1 text-sm font-medium text-[#2D6A4F] hover:text-[#1B4332] transition-colors">
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>
        {customer.notes?.length === 0 && (
          <p className="text-sm text-gray-400 italic">No notes yet.</p>
        )}
        <div className="space-y-3">
          {customer.notes?.map((note) => (
            <div
              key={note.id}
              className="bg-[#FDF6EC] rounded-lg p-4 border-l-[3px] border-[#D4A373]"
            >
              <p className="text-sm text-gray-800 font-serif leading-relaxed">
                {note.note}
              </p>
              <p className="text-xs text-gray-400 mt-2">— {formatFullDate(note.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Preferences Tab ────────────────────────────────────────
function PreferencesTab({ customer }) {
  const prefs = customer.preferences;
  if (!prefs) return <p className="text-gray-400 text-sm italic">No preferences set.</p>;

  const sections = [
    {
      title: 'Age & Physical',
      items: [
        ['Preferred Age', `${prefs.preferredAgeMin} – ${prefs.preferredAgeMax} years`],
        ['Preferred Height', `${prefs.preferredHeightMin} – ${prefs.preferredHeightMax} cm`],
      ],
    },
    {
      title: 'Location',
      items: [
        ['Preferred Cities', prefs.preferredCities?.join(', ') || '—'],
        ['Preferred Countries', prefs.preferredCountries?.join(', ') || '—'],
      ],
    },
    {
      title: 'Background',
      items: [
        ['Preferred Religions', prefs.preferredReligions?.length ? prefs.preferredReligions.join(', ') : 'No preference'],
        ['Preferred Castes', prefs.preferredCastes?.length ? prefs.preferredCastes.join(', ') : 'No preference'],
        ['Preferred Diets', prefs.preferredDiets?.length ? prefs.preferredDiets.join(', ') : 'No preference'],
      ],
    },
    {
      title: 'Financial',
      items: [
        ['Min Income', prefs.preferredIncomeMin ? `${prefs.preferredIncomeMin} LPA` : '—'],
      ],
    },
    {
      title: 'Deal Breakers',
      items: [
        ['Deal Breakers', prefs.dealBreakers?.length ? prefs.dealBreakers.join(', ') : 'None'],
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
          <dl className="space-y-3 text-sm">
            {section.items.map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-gray-500">{label}</dt>
                <dd className="text-gray-900 font-medium text-right max-w-[60%]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

// ─── Lifestyle Tab ──────────────────────────────────────────
function LifestyleTab({ customer }) {
  const items = [
    ['Diet', customer.diet],
    ['Smoking', customer.smoking],
    ['Drinking', customer.drinking],
    ['Relationship Goal', customer.relationshipGoal],
    ['Marriage Timeline', customer.marriageTimeline],
    ['Personality Type', customer.personalityType],
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(([label, value]) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Family Tab ─────────────────────────────────────────────
function FamilyTab({ customer }) {
  const items = [
    ['Family Preference', customer.familyPreference],
    ['Want Kids', customer.wantKids === 'YES' ? 'Yes' : customer.wantKids === 'NO' ? 'No' : 'Maybe'],
    ['Religion', customer.religion],
    ['Marital Status', maritalLabel(customer.maritalStatus)],
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map(([label, value]) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Notes Tab ──────────────────────────────────────────────
function NotesTab({ customer, onAddNote }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Notes</h3>
        <button onClick={onAddNote} className="flex items-center gap-1.5 text-sm font-medium text-[#2D6A4F] hover:text-[#1B4332] transition-colors">
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>
      {customer.notes?.length === 0 && (
        <p className="text-sm text-gray-400 italic">No notes yet. Add one to get started.</p>
      )}
      <div className="space-y-3">
        {customer.notes?.map((note) => (
          <div
            key={note.id}
            className="bg-[#FDF6EC] rounded-lg p-5 border-l-[3px] border-[#D4A373]"
          >
            <p className="text-sm text-gray-800 font-serif leading-relaxed">{note.note}</p>
            <p className="text-xs text-gray-400 mt-2">— {formatFullDate(note.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function CustomerProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('About');
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  const loadCustomer = () => {
    getCustomerById(id)
      .then((data) => {
        setCustomer(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Unable to load customer.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const handleSaveNote = async () => {
    if (!noteText || !noteText.trim()) {
      setIsAddingNote(false);
      return;
    }
    try {
      await createNote(id, noteText.trim());
      setNoteText('');
      setIsAddingNote(false);
      loadCustomer(); // reload customer to fetch new note
    } catch (err) {
      alert(err.message || "Failed to add note.");
    }
  };

  const handleAddNoteClick = () => {
    setIsAddingNote(true);
  };

  const handleGenerateMatches = async () => {
    setIsGenerating(true);
    try {
      await generateMatchesForCustomer(id);
      alert("Matches generated successfully. Check the Matches tab!");
      loadCustomer();
    } catch (err) {
      alert(err.message || "Failed to generate matches.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <p className="text-sm font-medium text-gray-500">Loading customer...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Customer not found</h2>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <Link
            to="/customers"
            className="text-[#2D6A4F] hover:text-[#1B4332] text-sm font-medium"
          >
            ← Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${customer.firstName} ${customer.lastName}`;
  const isHighIntent =
    customer.marriageTimeline &&
    (customer.marriageTimeline.includes('6 month') || customer.marriageTimeline.includes('1 year') || customer.marriageTimeline.includes('1-2'));

  const renderTab = () => {
    switch (activeTab) {
      case 'About':
        return <AboutTab customer={customer} onAddNote={handleAddNoteClick} />;
      case 'Preferences':
        return <PreferencesTab customer={customer} />;
      case 'Lifestyle':
        return <LifestyleTab customer={customer} />;
      case 'Family':
        return <FamilyTab customer={customer} />;
      case 'Notes':
        return <NotesTab customer={customer} onAddNote={handleAddNoteClick} />;
      default:
        return <AboutTab customer={customer} onAddNote={handleAddNoteClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/customers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2D6A4F] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Customers
        </Link>

        {/* ─── Profile Header ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <img
                src={getPhoto(customer)}
                alt={fullName}
                className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-2xl"
              />
              {customer.profileVerified && (
                <span className="absolute bottom-3 left-3 bg-[#2D6A4F] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Verified
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {/* Top row: Name, badge, actions */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                    {fullName}
                  </h1>
                  {isHighIntent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                      <Sparkles className="w-3 h-3" />
                      High Intent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                </div>
              </div>

              {/* Demographics */}
              <p className="text-gray-500 text-sm mb-2">
                {getAge(customer.dateOfBirth)} &bull; {genderLabel(customer.gender)} &bull; {[customer.city, customer.state || customer.country].filter(Boolean).join(', ') || 'Location not set'}
              </p>

              {/* Profession */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>
                  {[customer.designation, customer.company].filter(Boolean).join(' @ ') || 'Profession not set'}
                </span>
              </div>

              {/* Religion & Marital */}
              <p className="text-sm text-gray-600 mb-1.5">
                {[customer.religion, maritalLabel(customer.maritalStatus)].filter(Boolean).join(' • ') || 'Background not set'}
              </p>

              {/* Member since */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
                <Calendar className="w-4 h-4" />
                <span>Member since {formatDate(customer.createdAt)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={handleGenerateMatches} disabled={isGenerating} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg hover:bg-[#1B4332] transition-colors shadow-sm disabled:opacity-70">
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'Generate Matches'}
                </button>
                {!isAddingNote && (
                  <button onClick={handleAddNoteClick} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                )}
              </div>
              
              {isAddingNote && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type your note here..."
                    className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setIsAddingNote(false); setNoteText(''); }} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSaveNote} className="px-3 py-1.5 text-sm bg-[#2D6A4F] text-white hover:bg-[#1B4332] rounded-md transition-colors">
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Tabs ───────────────────────────────────────── */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#2D6A4F] text-[#2D6A4F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* ─── Tab Content ────────────────────────────────── */}
        {renderTab()}
      </div>
    </div>
  );
}
