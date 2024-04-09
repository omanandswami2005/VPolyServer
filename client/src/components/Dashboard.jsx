
import { Logoutbutton } from './Logout';
import { Button, Card, CardBody, CardGroup, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import Image from "react-bootstrap/Image";
import '../styles/Dashboard.css';

import { Link } from 'react-router-dom';
import img from '../images/Vpolyserver.webp';
import studentmgmt from '../images/studentmgmt.webp';
import viewattendance from '../images/viewattendance.webp';
import manualattendance from '../images/manualattendance.webp';
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
      <Image src={img} alt="VPolyServer_Image" className="logo" />
    
     
      </div>
  <h2 align="center" className='bg-dark text-white w-75 mx-auto mt-2 border hi'>Hello {name ? name: ''}  !!!</h2>


      <CardGroup className='cardgroup' >

        <div className ='div' >

          <Card className='dashcard '>
            <CardImg
              alt="Student Management "
              src={studentmgmt}
              top
              width="100%"
              
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : '#ccc', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
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
             <Link to='/dashboard/studentManagement' className='text-decoration-none'>
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
              alt="Manual Attendance"
              src={manualattendance}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : '#ccc', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
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
              alt="View Attendace"
              src={viewattendance}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : '#ccc', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
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
