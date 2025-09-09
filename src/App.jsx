import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Shared/Home';
import Register from './pages//Shared/Register';
import Login from './pages//Shared/Login';
import Profile from './pages/Profile';
import Layout from './componenets/shared/Layout';
import ProtectedRoute from './componenets/shared/ProtectedRoute';
import TraineeNutritionPage from './pages/liad/TraineeNutritionPage';
import NutritionPlan from './pages/Coaches/NutritionPlan'
import SearchPage from './pages/Clients/SearchPage';
import GuestRoute from './componenets/shared/GuestRoute';
import WorkoutPlan from './pages/Coaches/WorkoutPlan';
import ClientListPage from './pages/Coaches/ClientListPage';
import CoachSideClientProfile from './pages/Coaches/CoachSideClientProfile';
import CoachListPage from './pages/Clients/CoachListPage';




function App() {
  return (
    <BrowserRouter>
      <Layout>

        <Routes>
          {/* public */}
          <Route element={<GuestRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          
          
          {/* any logged in user */}
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>

          {/* coaches only */}
          <Route element={<ProtectedRoute allow={"coach"} />}>
            <Route path="/nutrition" element={<NutritionPlan />} /> 
            <Route path="/workout" element={<WorkoutPlan />} />
            <Route path="/clients" element={<ClientListPage />} />
            <Route path="/client-profile" element={<CoachSideClientProfile />} />

          </Route>

          {/* clients only */}
          <Route element={<ProtectedRoute allow={"client"} />}>
            <Route path="/diet" element={<TraineeNutritionPage />} />
            <Route path='/search' element={<SearchPage/>} />
            <Route path='/coach-list' element={<CoachListPage/>} />
          </Route>
                 
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
