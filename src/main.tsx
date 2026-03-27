import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './lib/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import Home from './pages/Home';
import Room from './pages/Room';
import RoomSnapshots from './pages/RoomSnapshots';
import SnapshotView from './pages/SnapshotView';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:roomId' element={<Room />} />
            <Route path='/room/:roomId/snapshots' element={<RoomSnapshots />} />
            <Route path='/room/:roomId/snapshots/:snapshotId' element={<SnapshotView />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);