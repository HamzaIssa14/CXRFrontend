import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { ModelDetail } from './pages/ModelDetail';
import { ModelPage } from './pages/ModelPage';

function App() {
  return (
    <Router>
      <ThemeProvider theme={{}}>
        <GlobalStyles />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/models/:modelId" element={<ModelDetail />} />
          <Route path="/models/:modelId/analyze" element={<ModelPage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;