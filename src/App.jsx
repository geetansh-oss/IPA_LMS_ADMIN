import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import './App.css';
import DashBoard from './Pages/DashBoard';
import Course from './Pages/Course';
import EditCourse from './Pages/EditCourse';
import EditModules from './Pages/EditModules';
import Login from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './Components/auth/PrivateRoute';
import Access from './Pages/Access';
import ManageContent from './Pages/ManageContent';
import CreateCourse from './Pages/CreateCourse';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path='/' element={<DashBoard />} />
            <Route path='/course' element={<Course />} />
            <Route path='/course/create' element={<CreateCourse />} />
            <Route path='/course/:courseId' element={<EditCourse />} />
            <Route path='/course/:courseId/modules' element={<EditModules />} />
            <Route path='/giveAccess' element={<Access />} />
            <Route path='/manageContent' element={<ManageContent />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
