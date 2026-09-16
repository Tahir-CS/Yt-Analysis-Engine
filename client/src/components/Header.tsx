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

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'predictor', label: 'ML Predictor', icon: '🧠' },
    { id: 'fyp-radar', label: 'FYP Radar', icon: '🚀' },
    { id: 'valuation', label: 'Valuation & CPM', icon: '💰' },
    { id: 'reports', label: 'PDF Reports', icon: '📄' },
    { id: 'about', label: 'About & Tech', icon: 'ℹ️' },
    { id: 'contact', label: 'Contact', icon: '✉️' },
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
            <span className="logo-icon">⚡</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">CreatorIQ</span>
            <span className="brand-version">2026 ENGINE</span>
          </div>
        </div>

        {/* Header Search Bar */}
        <form className="header-search-form" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search channel or @handle..."
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
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Controls: Status Badge + Theme Toggle + Mobile Menu */}
        <div className="header-actions">
          <div
            className={`status-indicator ${isBackendOnline ? 'online' : 'fallback'}`}
            title={isBackendOnline ? 'Fastify Backend connected' : 'Client-side fallback mode'}
          >
            <span className="status-dot"></span>
            <span className="status-text">{isBackendOnline ? 'API Connected' : 'Local Fallback'}</span>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle color theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
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
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
