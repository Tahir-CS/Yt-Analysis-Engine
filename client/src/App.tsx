import { useState, useEffect } from 'react';
import type { NavTab, ChannelData } from './types';
import { DEMO_CHANNELS, checkBackendHealth } from './services/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Predictor } from './pages/Predictor';
import { FypRadar } from './pages/FypRadar';
import { Valuation } from './pages/Valuation';
import { Reports } from './pages/Reports';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import './index.css';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentChannel, setCurrentChannel] = useState<ChannelData>(DEMO_CHANNELS.mrbeast);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [predictorInitialData, setPredictorInitialData] = useState<{ title: string; views: number } | null>(null);

  // Check backend connectivity on mount
  useEffect(() => {
    checkBackendHealth().then(({ online }) => {
      setIsBackendOnline(online);
    });
  }, []);

  // Theme synchronization
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearchChannel = (query: string) => {
    const cleanQuery = query.toLowerCase().replace('@', '').trim();
    if (DEMO_CHANNELS[cleanQuery]) {
      setCurrentChannel(DEMO_CHANNELS[cleanQuery]);
    } else {
      const match = Object.values(DEMO_CHANNELS).find(
        (c) => c.name.toLowerCase().includes(cleanQuery) || c.handle.toLowerCase().includes(cleanQuery)
      );
      if (match) {
        setCurrentChannel(match);
      }
    }
  };

  const handleLoadVideoToPredictor = (title: string, views: number) => {
    setPredictorInitialData({ title, views });
    setCurrentTab('predictor');
  };

  return (
    <div className={`app-shell ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isBackendOnline={isBackendOnline}
        onSearchChannel={handleSearchChannel}
      />

      <main className="main-content-area">
        {currentTab === 'dashboard' && (
          <Dashboard
            currentChannel={currentChannel}
            onSelectChannel={setCurrentChannel}
            onNavigate={setCurrentTab}
            onLoadVideoToPredictor={handleLoadVideoToPredictor}
          />
        )}

        {currentTab === 'predictor' && (
          <Predictor
            currentChannel={currentChannel}
            initialVideoTitle={predictorInitialData?.title}
            initialViews={predictorInitialData?.views}
          />
        )}

        {currentTab === 'fyp-radar' && <FypRadar />}

        {currentTab === 'valuation' && <Valuation currentChannel={currentChannel} />}

        {currentTab === 'reports' && <Reports currentChannel={currentChannel} />}

        {currentTab === 'about' && <About />}

        {currentTab === 'contact' && <Contact />}
      </main>

      <Footer onSelectTab={setCurrentTab} />
    </div>
  );
}

export default App;
