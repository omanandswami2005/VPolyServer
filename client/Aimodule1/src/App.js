import Login from './components/Login';

import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AiAttendace from './components/AiAttendance';
import  { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { Logoutpage} from './components/Logout';
import ManualAttendance from './components/ManualAttendance';
import FillAttendanceForToday from './components/TodaysAttendance';
import ClassManagement from './views/ClassManagement';

import StudentManagement from './views/StudentManagement';
import ClassStudentMgmtView from './views/ClassStudentMgmtView'
import Faculty1 from './views/FacultyView';
import ViewAttendanceView from './views/ViewAttendanceView';


// import './styles/welToastStyle.css'; // Import your global CSS file


const App = ()=> {
  return (
    <div>
     <Routes>
      <Route path="/logout" element={<Logoutpage />} />
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} path="/dashboard" />} />

      

        <Route path="/dashboard/ai" element={<ProtectedRoute component={AiAttendace} path="/dashboard" />} />

        <Route path="/dashboard/startmanualattendance" element={<ProtectedRoute component={ManualAttendance} path="/dashboard" />} />

        <Route path="/dashboard/viewattendance" element={<ProtectedRoute component={ViewAttendanceView} path="/dashboard"  />} />
        
        <Route path="/dashboard/todayattendance" element={<ProtectedRoute component={FillAttendanceForToday} path="/dashboard" />} />

        <Route path="/dashboard/classstudentmgmt" element={<ProtectedRoute component={ClassStudentMgmtView} path="/dashboard" />} />

        <Route path="/dashboard/addclass" element={<ProtectedRoute component={ClassManagement} path="/dashboard" props="addclass" />} />

        <Route path="/dashboard/showclasses" element={<ProtectedRoute component={ClassManagement} path="/dashboard" props="showclass" />} />

        <Route path="/dashboard/addstudent" element={<ProtectedRoute component={StudentManagement} path="/dashboard" props="addstudent" />} />

        <Route path="/dashboard/showstudents" element={<ProtectedRoute component={StudentManagement} path="/dashboard" props="showstudent" />} />

        <Route path="/dashboard/faculty" element={<ProtectedRoute component={Faculty1} path="/dashboard" props="showstudent" />} />


     



        {/* <Route path="/addstudent" element={<StudentManagement props="addstudent" />} />

        <Route path="/showstudents" element={<StudentManagement props="showstudent" />} /> */}

        {/* <Route path="/student" component={StudentManagement} />
        <Route path="/faculty" component={FacultyManagement} />
        <Route path="/edit/:id" component={EditView} />
        <Route path="/delete/:id" component={DeleteView} /> */}
        
      </Routes>
      <Toaster position="top-right"    toastOptions={{duration: 3000 ,  style: {
            color: 'black',
            background: 'linear-gradient(45deg, rgb(255, 171, 171), rgb(218, 218, 218))',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            fontFamily: 'times new roman',
  
          }}}/>

    </div>

  );
}

export default App;
