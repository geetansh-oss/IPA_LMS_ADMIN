import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import './App.css';
import Home from './Pages/Home';
import DashBoard from './Pages/DashBoard';
import Course from './Pages/Course';
import CreateCourse from './Pages/CreateCourse';
import EditCourse from './Pages/EditCourse';
import Lecture from './Pages/Lecture';

function App() {
  return (
   <BrowserRouter>
     <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element= {<Home/>}/>
          <Route path='/dashboard' element= {<DashBoard/>}/>
          <Route path='/course' element= {<Course/>}/>
          <Route path='/course/create' element= {<CreateCourse/>} />
          <Route path='/course/:courseId' element={<EditCourse/>} />
          <Route path='/course/:courseId/lecture' element={<Lecture/>} />
          {/*
          <Route path='/course/:courseId/lecture/:lectureId' element={<EditLecture/>} />*/}
        </Route>
     </Routes>
   </BrowserRouter>
  )
}

export default App;