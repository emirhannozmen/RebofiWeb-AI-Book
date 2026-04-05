import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import MyBooksPage from './pages/MyBooksPage';
import GetRecommendationsPage from './pages/GetRecommendationsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import WelcomePage from './pages/WelcomePage';

// Placeholders to be replaced by real pages
//const MyBooksPage = () => <div className="p-8">My Books (Placeholder)</div>;
//const GetRecommendationsPage = () => <div className="p-8">Get Recommendations (Placeholder)</div>;
//const RecommendationsPage = () => <div className="p-8">Recommendations (Placeholder)</div>;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            
            <Route 
              path="/books" 
              element={
                <ProtectedRoute>
                  <MyBooksPage />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/recommendations/generate" 
              element={
                <ProtectedRoute>
                  <GetRecommendationsPage />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/recommendations" 
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              } 
            />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;