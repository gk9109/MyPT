import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './componenets/shared/Layout';
import ProtectedRoute from './componenets/shared/ProtectedRoute';
import WorkoutPlan from './pages/Coaches/WorkoutPlan';

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
            
            <Route path='/diet' element={<WorkoutPlan />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
