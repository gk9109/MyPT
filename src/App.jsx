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
import ClientSetUp from './pages/Coaches/ClientSetUp';
import CoachListPage from './pages/Clients/CoachListPage';
import ChatPage from './pages/Shared/ChatPage';
import CoachSetUp from './pages/Clients/MyPlans';
import UploadVideosPage from './pages/Coaches/UploadVideosPage';
import AdminDashboard from './pages/admin/AdminDashboard'
import Reports from './pages/admin/Reports'
import UserList from './pages/admin/UserList'
import SchedulePage from './pages/Coaches/SchedulePage';
import ClientProfilePage from './pages/Clients/ClientProfilePage';
import PasswordReset from './pages/Shared/PasswordReset';
import ArticlePage from './pages/Clients/ArticlePage';
import CoachProfilePage from './pages/Coaches/CoachProfilePage';



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
            <Route path="/PasswordReset" element={<PasswordReset />} />
          </Route>
          
          
          
          {/* any logged in user */}
          <Route element={<ProtectedRoute />}>
            

            {/* The colon : means this part is a parameter */}
            <Route path="/chat/:subscriptionId" element={<ChatPage />} />
          </Route>

          {/* coaches only */}
          <Route element={<ProtectedRoute allow="coach" />}>
            <Route path="/nutrition" element={<NutritionPlan />} /> 
            <Route path="/workout" element={<WorkoutPlan />} />
            <Route path="/clients" element={<ClientListPage />} />
            <Route path="/client-profile" element={<ClientSetUp />} />
            <Route path="/videos" element={<UploadVideosPage />} /> 
            <Route path='/profile' element={<CoachProfilePage />} />
            <Route path='/schedule' element={<SchedulePage />} />
        
          </Route>

          {/* clients only */}
          <Route element={<ProtectedRoute allow="client" />}>
            <Route path="/diet" element={<TraineeNutritionPage />} />
            <Route path='/search' element={<SearchPage/>} />
            <Route path='/coach-list' element={<CoachListPage/>} />
            <Route path='/plans' element={<CoachSetUp/>} />
            {/* <Route path='/profile' element={<ClientProfilePage />} /> */}
            <Route path='/client/profile' element={<ClientProfilePage />} />
            {/* <Route path='/daily-article' element={<ArticlePage />} /> */}
          </Route>

          {/* admin only */}
          <Route element={<ProtectedRoute allow="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/users" element={<UserList />} />
            {/* <Route path='/client/profile' element={<Profile />} /> */}
          </Route>
                 
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
