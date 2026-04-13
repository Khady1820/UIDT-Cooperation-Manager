import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Conventions from './pages/Conventions';
import ConventionDetails from './pages/ConventionDetails';
import Settings from './pages/Settings';
import PartnerDashboard from './pages/PartnerDashboard';
import Register from './pages/Register';
import Indicators from './pages/Indicators';
import Validation from './pages/Validation';
import Timeline from './pages/Timeline';
import Help from './pages/Help';
import Notifications from './pages/Notifications';
import Archived from './pages/Archived';
import ManageUsers from './pages/ManageUsers';
import ManagePartners from './pages/ManagePartners';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SearchProvider>
            <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conventions" element={
                <ProtectedRoute>
                  <Layout>
                    <Conventions />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/validation" element={
                <ProtectedRoute>
                  <Layout>
                    <Validation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/timeline" element={
                <ProtectedRoute>
                  <Layout>
                    <Timeline />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conventions/:id" element={

                <ProtectedRoute>
                  <Layout>
                    <ConventionDetails />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/partenaire" element={
                <ProtectedRoute>
                  <Layout>
                    <PartnerDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/indicators" element={
                <ProtectedRoute>
                  <Layout>
                    <Indicators />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/help" element={
                <ProtectedRoute>
                  <Layout>
                    <Help />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/archived" element={
                <ProtectedRoute>
                  <Layout>
                    <Archived />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/manage-users" element={
                <ProtectedRoute>
                  <Layout>
                    <ManageUsers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/manage-partners" element={
                <ProtectedRoute>
                  <Layout>
                    <ManagePartners />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SearchProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
  );
}

export default App;
