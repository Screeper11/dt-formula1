import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Drivers from './Drivers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/drivers" />} />
        <Route path="/drivers" element={<Drivers />} />
      </Routes>
    </Router>
  );
}

export default App;
