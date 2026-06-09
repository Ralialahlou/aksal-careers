import { Routes, Route, Navigate } from 'react-router-dom';
import BackofficeLayout from './BackofficeLayout.jsx';
import LoginPage from './LoginPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import CandidaturesList from './CandidaturesList.jsx';
import CandidatureProfile from './CandidatureProfile.jsx';

export default function BackofficeRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<BackofficeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="candidatures" element={<CandidaturesList />} />
        <Route path="candidatures/:id" element={<CandidatureProfile />} />
      </Route>
    </Routes>
  );
}
