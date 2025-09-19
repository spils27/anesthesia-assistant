import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Index from '@/pages/Index';
import PatientInfoPage from '@/pages/PatientInfoPage';
import AnesthesiaPage from '@/pages/AnesthesiaPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patient-info" element={<PatientInfoPage />} />
          <Route path="/anesthesia" element={<AnesthesiaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;