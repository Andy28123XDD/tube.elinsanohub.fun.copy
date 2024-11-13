import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import ChannelPage from './pages/ChannelPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/channel/:channelId/*" element={<ChannelPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;