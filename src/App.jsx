import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import DashBoard from './Pages/DashBoard';
import Course from './Pages/Course';
import './App.css'
import Layout from './Layout';
import CreateCourse from './Pages/CreateCourse';

function App() {
  return (
   <BrowserRouter>
     <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element= {<Home/>}/>
          <Route path='/dashboard' element= {<DashBoard/>}/>
          <Route path='/course' element= {<Course/>}/>
          <Route path='/createCourse' element= {<CreateCourse/>} />
        </Route>
     </Routes>
   </BrowserRouter>
  )
}

export default App;
