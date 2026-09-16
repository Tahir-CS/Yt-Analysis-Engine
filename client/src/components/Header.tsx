import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NavTab } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isBackendOnline: boolean;
  onSearchChannel?: (query: string) => void;
}

export const Header = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  isBackendOnline,
  onSearchChannel,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'predictor', label: 'View Forecast' },
    { id: 'fyp-radar', label: 'Hook Analyzer' },
    { id: 'valuation', label: 'Sponsorship Value' },
    { id: 'reports', label: 'Media Kit' },
    { id: 'about', label: 'Architecture' },
    { id: 'contact', label: 'Support' },
  ];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearchChannel) {
      onSearchChannel(searchInput.trim());
      onSelectTab('dashboard');
      setSearchInput('');
    }
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand" onClick={() => onSelectTab('dashboard')}>
          <div className="logo-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">CreatorIQ</span>
            <span className="brand-version">ANALYTICS</span>
          </div>
        </div>

        {/* Header Search Bar */}
        <form className="header-search-form" onSubmit={handleSearch}>
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search channel (@MrBeast, @MKBHD...)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="header-search-input"
          />
        </form>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Controls: Status Badge + Theme Toggle + Mobile Menu */}
        <div className="header-actions">
          <div
            className={`status-indicator ${isBackendOnline ? 'online' : 'fallback'}`}
            title={isBackendOnline ? 'Connected to local API' : 'Running in browser demo mode'}
          >
            <span className="status-dot"></span>
            <span className="status-text">{isBackendOnline ? 'API Active' : 'Demo Mode'}</span>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle color theme"
          >
            {isDarkMode ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-link ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
