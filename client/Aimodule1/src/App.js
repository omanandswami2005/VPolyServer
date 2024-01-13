import Login from './components/Login';

import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AiAttendace from './components/AiAttendance';
import  { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { Logoutpage} from './components/Logout';
import ManualAttendance from './components/ManualAttendance';
import StudentAttendanceTable from './components/StudentAttendanceTable';
import ClassManagement from './views/ClassManagement';

import StudentManagement from './views/StudentManagement';
import ClassStudentMgmtView from './views/ClassStudentMgmtView'
import Faculty1 from './views/FacultyView';
import ViewAttendanceView from './views/ViewAttendanceView';
import ScheduleManagementView from './views/ScheduleManagementView';



const App = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
     <Routes>
      <Route path="/logout" element={<Logoutpage />} />
      
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

      <Route path = '/dashboard/sheet' element={<StudentAttendanceTable />} />

        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} path="/dashboard" />} />

        {/* <Route path="/dashboard/spinner" element={<DNASpinner />} /> */}

      
        <Route path="/dashboard/ai" element={<ProtectedRoute component={AiAttendace} path="/auth/loggedIn" />} />

        <Route path="/dashboard/startmanualattendance" element={<ProtectedRoute component={ManualAttendance} path="/auth/loggedIn" />} />

        

        <Route path="/dashboard/viewattendance" element={<ProtectedRoute component={ViewAttendanceView} path="/auth/loggedIn"  />} />
    

        <Route path="/dashboard/classstudentmgmt" element={<ProtectedRoute component={ClassStudentMgmtView} path="/auth/loggedIn" />} />

        <Route path="/dashboard/classManagement" element={<ProtectedRoute component={ClassManagement} path="/auth/loggedIn" />} />

        

        <Route path="/dashboard/studentManagement" element={<ProtectedRoute component={StudentManagement} path="/auth/loggedIn" />} />

      

        <Route path="/dashboard/faculty" element={<ProtectedRoute component={Faculty1} path="/auth/loggedIn" />} />

        <Route path="/dashboard/scheduleSetup" element={<ProtectedRoute component={ScheduleManagementView} path="/auth/loggedIn" />} />


     



        
        
      </Routes>
      <Toaster position="top-right"    toastOptions={{duration: 3000 ,
      closeButton: true,
        style: {
            color: 'black',
            background: 'linear-gradient(45deg, rgb(255, 171, 171), rgb(218, 218, 218))',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            fontFamily: 'times new roman',
  
          }}}/>

          {/* Dark mode toggle button */}
      <div className="toggle-dark-mode">
        <label>
          <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
          Dark Mode
        </label>
      </div>

    </div>

  );
}

export default App;
