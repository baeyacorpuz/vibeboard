import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './lib/ThemeContext';
import './index.css';
import Home from './pages/Home';
import Room from './pages/Room';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:roomId' element={<Room />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
  </StrictMode>,
);
