import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './componenets/shared/Layout';
import ProtectedRoute from './componenets/shared/ProtectedRoute';
// import CoachNutritionPage from './pages/CoachNutritionPage';
import TraineeNutritionPage from './pages/TraineeNutritionPage';
import DietRouter from './pages/DietRouter';
import SearchPage from './pages/Clients/SearchPage';
import GuestRoute from './componenets/shared/GuestRoute';




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
            {/* <Route path="/coach/nutrition" element={<NutritionForm />} /> */}
          </Route>

          {/* clients only */}
          <Route element={<ProtectedRoute allow={["client"]} />}>
            <Route path="/diet" element={<TraineeNutritionPage />} />
            <Route path="/diet" element={<DietRouter />} />
            {/* <Route path="/coach-nutrition" element={<CoachNutritionPage />} /> */}
            {/* <Route path="/trainee-nutrition" element={<TraineeNutritionPage />} /> */}
            <Route path='/search' element={<SearchPage/>} />
          </Route>
                 
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
