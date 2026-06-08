import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CareersPage from './pages/CareersPage';
import ApplyPage from './pages/ApplyPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-dvh">
        <Header />
        <Routes>
          <Route path="/" element={<CareersPage />} />
          <Route path="/candidature" element={<ApplyPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
