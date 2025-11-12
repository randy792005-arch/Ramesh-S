import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import BookingConfirmation from './pages/booking-confirmation';
import LoginPage from './pages/login';
import BookingHistory from './pages/booking-history';
import StationDetails from './pages/station-details';
import Register from './pages/register';
import SettingsPage from './pages/settings';
import ProfilePage from './pages/profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
  {/* Define your route here */}
  {/* Redirect root path to login page */}
  <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/station-details" element={<StationDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
