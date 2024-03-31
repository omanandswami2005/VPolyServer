import Login from './components/Login';
import { useEffect,useCallback } from 'react';
import { Routes, Route,useLocation } from "react-router-dom";
import Home from './components/Home';
import Dashboard from './components/Dashboard';

// import Dashboard1 from './components/Dashboard1';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import  { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
// import { Logoutpage} from './components/Logout';
import ManualAttendance from './components/ManualAttendaceShallowCopy';
import ClassManagement from './views/ClassManagement';
import StudentManagement from './views/StudentManagement';
import FacultyManagement from './views/FacultyView';
// import ViewAttendanceView from './views/ViewAttendanceView';
import ScheduleManagementView from './views/ScheduleManagementView';
import { useDarkMode } from './DarkModeContext';
import { ThemeProvider, createTheme } from '@mui/material';
import DarkModeToggler from './components/DarkModeButton/DarkModeToggler';

const App = () => {
  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const theme = createTheme({
    palette: {
      mode: !isDarkMode ? 'dark' : 'light',
    },
  })

  // Function to update styles of body and html
  const updateBodyStyles = useCallback(() => {
    document.body.style.background = isDarkMode
      ? 'linear-gradient(45deg, rgb(253, 253, 253), rgb(69, 240, 252))'
      : 'linear-gradient(45deg, rgb(0, 0, 0), rgb(0, 0, 0))';
    document.body.style.color = isDarkMode ? 'black' : 'white';
    document.documentElement.style.background = isDarkMode
      ? 'linear-gradient(45deg, rgb(253, 253, 253), rgb(69, 240, 252))'
      : 'linear-gradient(45deg, rgb(0, 0, 0), rgb(0, 0, 0))';
    document.documentElement.style.color = isDarkMode ? 'black' : 'white';
  }, [isDarkMode]);

  // Call the function when component mounts and when dark mode changes
  useEffect(() => {
    updateBodyStyles();
  }, [isDarkMode,updateBodyStyles]);
  const notShowNavBarPaths = ['/', '/login','/dashboard'];


  return (
    <div  className="App">
      <ThemeProvider theme={theme}>
            {!notShowNavBarPaths.includes(location.pathname) ? <ResponsiveDrawer /> : <DarkModeToggler /> }

 
{/* <ResponsiveDrawer /> */}
     <Routes>
      
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} path="/dashboard" />} />

        <Route path="/dashboard/startmanualattendance" element={<ProtectedRoute component={ManualAttendance}  />} />

        

        {/* <Route path="/dashboard/viewattendance" element={<ProtectedRoute component={ViewAttendanceView}   />} /> */}


        <Route path="/dashboard/classManagement" element={<ProtectedRoute component={ClassManagement}  />} />

        <Route path="/dashboard/studentManagement" element={<ProtectedRoute component={StudentManagement}  />} />

        <Route path="/dashboard/faculty" element={<ProtectedRoute component={FacultyManagement}  />} />

        <Route path="/dashboard/scheduleSetup" element={<ProtectedRoute component={ScheduleManagementView}  />} />


      </Routes>
      
      <Toaster position="top-right"    toastOptions={{duration: 3000 ,
        style: {
            color: 'black',
            background: 'linear-gradient(45deg, rgb(255, 171, 171), rgb(218, 218, 218))',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            fontFamily: 'times new roman',
  
          }}}/>
</ThemeProvider>
    </div>
  );
}

export default App;
