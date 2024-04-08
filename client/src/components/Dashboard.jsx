
import { Logoutbutton } from './Logout';
import { Button, Card, CardBody, CardGroup, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import Image from "react-bootstrap/Image";
import '../styles/Dashboard.css';

import { Link } from 'react-router-dom';
import img from '../images/Vpolyserver.png';
import studentmgmt from '../images/studentmgmt.jpg';
import viewattendance from '../images/viewattendance.jpg';
import manualattendance from '../images/manualattendance.jpg';
import StdFacCls from '../components/StudentFacultyClassCard';

import '../styles/imageStyle.css';
import { useDarkMode } from '../DarkModeContext';



  const Dashboard = (props) => {

  const { isDarkMode } = useDarkMode();
  const userData = props.userData;
  
// const navigate = useNavigate();
const name = userData.name;
const role = userData.role;

console.log(userData.role);
const cardSub=(
  <CardSubtitle
  className={`mb-2 ${!isDarkMode ? 'text-warning' : 'text-muted'}`}
  tag="h6"
>
  ...By VPolyServer
</CardSubtitle>
)

  return (
    <div >

<div className="img">
      <Image src={img} className="logo" />
    
     
      </div>
  <h2 align="center" className='bg-dark text-white w-75 mx-auto mt-2 border hi'>Hello {name ? name: ''}  !!!</h2>


      <CardGroup className='cardgroup' >

        <div className ='div' >

          <Card className='dashcard '>
            <CardImg
              alt="AI_Attemdance_System"
              src={studentmgmt}
              top
              width="100%"
              
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : 'white', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
              <CardTitle tag="h5" className='hi'>
                #Student_Management
              </CardTitle>
             {cardSub}
              <CardText>
               The VPolyServer is a Project/Product By Students of VAPM Collage of Polytechnic, Latur.
               <br />
               Presenting You Our AI Attendance System To Automate and Monitor The Attendance of Students. <br />
               Yup ! Our Motto is "Let's Automate The Things !".
              </CardText>
             <Link to='/dashboard/studentManagement'>
              <Button className='bg-dark m-auto w-75 d-block'>
              <h4 >
              Manage Students !
              </h4>
            </Button>
            </Link>
            </CardBody>
          </Card>
        </div>
    



        <div className ='div'>
          <Card className='dashcard'>
            <CardImg
              alt="Card image cap"
              src={manualattendance}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : 'white', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
              <CardTitle tag="h5" className='hi'>
                #Manual :: Attendace :: System
              </CardTitle>
             {cardSub}
              <CardText>
                Want To Take Attendace Manually ? <br />
                Or Want to Change Attendance ? <br />This Will Navigate To the Manual Attendace Page of VPolyServer Where You Can Take The Attendace of All Students Manually For Respectively Date & Time Slot.
             <br />  Yup ! Our Motto is "Let's Automate The Things !"
              </CardText>
              <Link to='/dashboard/startmanualattendance'>
              <Button className='bg-primary'>
                <h4>Take Me To <br /> Manual Attendace !</h4>
              </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

       
        <div className ='div'>
          <Card className='dashcard'>
            <CardImg
              alt="Card image cap"
              src={viewattendance}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : 'white', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
              <CardTitle tag="h5" className='hi'>
                #View...The...Attendace
              </CardTitle>
             {cardSub}
              <CardText>
                Want To View The Attendace of Students ? <br />
                This Will Navigate To the View Attendance Page of VPolyServer Where You Can View The Attendace of All Students That Are Listed In the Our System By Faculty of Respectitive Department.
              </CardText>
              <Link to='/dashboard/viewattendance'>
              <Button className='bg-danger' 
              > 
                <h4>
                  Take Me To <br /> View Attendace !
                </h4>
              </Button>
              </Link>
            </CardBody>
          </Card >
        </div>
       

 <StdFacCls role={role} /> 
 
      
      </CardGroup>

<div className="logout my-2 mx-auto w-20">

      <Logoutbutton />
      </div>

    </div>
  );
}

export default Dashboard;




// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Button, Card, CardContent, CardMedia, Grid, Typography ,createTheme, ThemeProvider } from '@mui/material';
// // import Image from '@mui/material/Image';
// import { Logoutbutton } from './Logout';
// import vapm from '../images/vapmlogo.png';
// import img from '../images/Vpolyserver.png';
// // import aiimg from '../images/aiimg.jpg';
// import studentmgmt from '../images/studentmgmt.jpg';
// import manualattendance from '../images/manualattendance.jpg';
// import viewattendance from '../images/viewattendance.jpg';
// import StdFacCls from '../components/StudentFacultyClassCard';
// import '../styles/Dashboard.css';
// import { useDarkMode } from '../DarkModeContext';

// const Dashboard = (props) => {
//   const {isDarkMode} = useDarkMode();
//   const darkTheme = createTheme({
//     palette: {
//       mode: `${!isDarkMode ? 'dark' : 'light'}`,
  
//     },
//   });
//   const userData = props.userData;
//   const name = userData.name;
//   const role = userData.role;

//   return (
//     <div>
//       <ThemeProvider theme={darkTheme}>

//       <Grid container justifyContent="center" alignItems="center" spacing={4}>
        
//         <Grid item xs={12}>
//           <div className="img">
//             <Image src={img} className="logo" /> &nbsp;&nbsp;
//             <h1 className="fw-bold fs-10"> &#43;</h1>&nbsp;
//             <Image src={vapm} className="vapm" />
//           </div>
//           <Typography align="center" varient="h1" className="bg-dark text-white w-75 mx-auto mt-1 border hi" sx={{fontFamily:'Algerian', fontSize:'2rem'}}>
//            Hello {name ? name : ''} !
//           </Typography>
//         </Grid>


//         <Grid item xs={12} container spacing={3} justifyContent="center" alignItems="center">

//           <Grid item xs={12} md={4} > 
//             <Card className="dashcard mx-3">
//               <CardMedia component="img" alt="Student_Management_System" height="auto" image={studentmgmt} />
//               <CardContent>
//               <Typography variant="h5" className="hi">
//                 #Student_Management_System
//                 </Typography>
//                 <Typography variant="subtitle1" className="mb-2 text-muted">
//                   ...By VPolyServer
//                 </Typography>
//                 <Typography variant="body1">
//                   The VPolyServer is a Project/Product By Students of VAPM Collage of Polytechnic, Latur.
//                   <br />
//                   Presenting You Our Attendance Management System To Minimize The Manual Work and Monitor The Attendance of Students. <br />  
//                   Yup! Our Motto is "Let's Automate The Things!".
//                 </Typography>
//                 <Link to="/dashboard/studentManagement">
//                   <Button variant="contained" className="bg-warning">
//                     <Typography varient="h5" className="text-dark">Take Me To <br /> Student Management!</Typography>
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Card className="dashcard">
//               <CardMedia component="img" alt="Card image cap" height="auto" image={manualattendance} />
//               <CardContent>
//                 <Typography variant="h5" className="hi">
//                   #Manual :: Attendace :: System
//                 </Typography>
//                 <Typography variant="subtitle1" className="mb-2 text-muted">
//                   ...By VPolyServer
//                 </Typography>
//                 <Typography variant="body1">
//                   Want To Take Attendace Manually? <br />
//                   Or Want to Change Attendance? <br />This Will Navigate To the Manual Attendace Page of VPolyServer Where You Can Take The Attendace of All Students Manually For Respectively Date & Time Slot.
                  
//                 </Typography>
//                 <Link to="/dashboard/startmanualattendance" >
//                   <Button variant="contained" color="primary" className="bg-primary">
//                     <Typography varient="h5" className="text-white">Take Me To <br /> Manual Attendance !</Typography>
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={4} >
//             <Card className="dashcard">
//               <CardMedia component="img" alt="Card image cap" height="auto" image={viewattendance} />
//               <CardContent>
//                 <Typography variant="h5" className="hi">
//                   #View...The...Attendace
//                 </Typography>
//                 <Typography variant="subtitle1" className="mb-2 text-muted">
//                   ...By VPolyServer
//                 </Typography>
//                 <Typography variant="body1">
//                   Want To View The Attendace of Students? <br />
//                   This Will Navigate To the View Attendance Page of VPolyServer Where You Can View The Attendace of All Students That Are Listed In the Our System. 
//                 </Typography>
//                 <Link to="/dashboard/viewattendance">
//                   <Button variant="contained" color="primary" className="bg-danger">
//                     <Typography varient="h5" className="text-white">Take Me To <br /> View Attendace !</Typography>
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {role === 'HOD' || role === 'Admin' ? <StdFacCls role={role} /> : null}
//       </Grid>

//       <div className="logout my-2 mx-auto w-20">
//         <Logoutbutton />
//       </div>
//       </ThemeProvider>
//     </div>
//   );
// };

// export default Dashboard;
