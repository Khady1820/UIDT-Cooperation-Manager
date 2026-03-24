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

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
