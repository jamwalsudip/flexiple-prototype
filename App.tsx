import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TalentSearch from './pages/TalentSearch';
import JobPost from './pages/JobPost';
import TalentOnboarding from './pages/TalentOnboarding';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TalentSearch />} />
        <Route path="/post-job" element={<JobPost />} />
        <Route path="/talent-join" element={<TalentOnboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;