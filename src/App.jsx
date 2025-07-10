import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './componenets/shared/Layout';
import ProtectedRoute from './componenets/shared/ProtectedRoute';
import CoachNutritionPage from './pages/CoachNutritionPage';
import TraineeNutritionPage from './pages/TraineeNutritionPage';
import DietRouter from './pages/DietRouter';
import Sidebar from "./componenets/coach/CoachSidebar";




function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/coach/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/diet" element={<DietRouter />} />
            <Route path="/coach-nutrition" element={<CoachNutritionPage />} />
            <Route path="/trainee-nutrition" element={<TraineeNutritionPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
