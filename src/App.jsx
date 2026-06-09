import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CareersPage from './pages/CareersPage';
import ApplyPage from './pages/ApplyPage';
import BackofficeRouter from './backoffice/BackofficeRouter.jsx';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<CareersPage />} />
          <Route path="/candidature" element={<ApplyPage />} />
        </Route>
        <Route path="/backoffice/*" element={<BackofficeRouter />} />
      </Routes>
    </BrowserRouter>
  );
}
