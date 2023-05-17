import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Homepage from './components/Homepage'
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register/>} />
        <Route path="/home" element={<Homepage/>} />
      </Routes>
    </Router>
  );
};

export default App;
