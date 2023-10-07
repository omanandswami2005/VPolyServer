import Login from './components/Login';

import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import  { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { Logoutpage} from './components/Logout';
import Profile1 from './components/Profile1';
// import './styles/welToastStyle.css'; // Import your global CSS file

// import Profile from '../src/components/Profile';

const App = ()=> {
  return (
    <div>
     <Routes>
      <Route path="/logout" element={<Logoutpage />} />
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} path="/dashboard" />} />

        <Route path="/dashboard/profile" element={<ProtectedRoute component={Profile1} path="/dashboard/profile" />} />
        
      </Routes>
      <Toaster position="top-center"    toastOptions={{duration: 3000}}/>

    </div>

  );
}

export default App;
