import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Shared/Home';
import Register from './pages//Shared/Register';
import Login from './pages//Shared/Login';
import Profile from './pages/Profile';
import Layout from './componenets/shared/Layout';
import ProtectedRoute from './componenets/shared/ProtectedRoute';
import TraineeNutritionPage from './pages/liad/TraineeNutritionPage';
import NutritionForm from './pages/liad/NutritionForm'
import SearchPage from './pages/Clients/SearchPage';
import GuestRoute from './componenets/shared/GuestRoute';
import WorkoutPlan from './pages/liad/WorkoutPlan';
import ClientListPage from './pages/Coaches/ClientListPage';




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
            <Route path="/nutrition" element={<NutritionForm />} /> 
            <Route path="/workout" element={<WorkoutPlan />} />
            <Route path="/clients" element={<ClientListPage />} />

          </Route>

          {/* clients only */}
          <Route element={<ProtectedRoute allow={"client"} />}>
            <Route path="/diet" element={<TraineeNutritionPage />} />
            <Route path='/search' element={<SearchPage/>} />
          </Route>
                 
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
