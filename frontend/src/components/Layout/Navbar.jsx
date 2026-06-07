import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import { getStoredMatchmaker, logout } from '../../services/authService';

const LOGO_URL = 'https://wenqiubmwpwncxtaqfgz.supabase.co/storage/v1/object/public/images/thedatecrew_logo.jpg';
const DEFAULT_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const matchmaker = getStoredMatchmaker();
  const userName = matchmaker?.name || 'Matchmaker';
  const userRole = 'Matchmaker';
  const userAvatar = matchmaker?.avatar || DEFAULT_AVATAR;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Customers', path: '/customers' },
    { label: 'Matches', path: '/matches' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                <img
                  src={LOGO_URL}
                  alt="The Date Crew"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-primary">tdc</span>';
                  }}
                />
              </div>
              <span className="font-serif text-lg font-semibold text-text tracking-tight">
                The Date Crew
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-5 text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-text'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-accent rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">


            {/* Divider */}
            <div className="w-px h-8 bg-border mx-1" />

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg">
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text leading-tight">{userName}</p>
                <p className="text-[11px] text-text-secondary leading-tight">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-hover transition-all duration-200"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg animate-slide-up">
          <div className="max-w-[1400px] mx-auto px-6 py-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search customers, matches..."
                className="input-field pl-10"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
