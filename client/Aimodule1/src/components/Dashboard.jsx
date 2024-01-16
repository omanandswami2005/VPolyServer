
import { Logoutbutton } from './Logout';
// import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardGroup, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';
// import { useNavigate } from 'react-router-dom'
import Image from "react-bootstrap/Image";
import '../styles/Dashboard.css';

import { Link } from 'react-router-dom';
import img from '../images/Vpolyserver.png';
import aiimg from '../images/aiimg.jpg';
import viewattendance from '../images/viewattendance.jpg';
import manualattendance from '../images/manualattendance.jpg';
import StdFacCls from '../components/StudentFacultyClassCard';

import '../styles/imageStyle.css';
import vapm from '../images/vapmlogo.png';


  const Dashboard = (props) => {

  const userData = props.userData;
  
// const navigate = useNavigate();
const name = userData.name;
const role = userData.role;

console.log(userData.role);
  return (
    <div>

<div className="img">
      <Image src={img} className="logo" /> &nbsp;&nbsp;
     <h1 className='fw-bold fs-10'> &#43;</h1>&nbsp;
      <Image src={vapm} className="logo" />
      </div>
<h2 align="center" className='bg-dark text-white w-50 mx-auto mt-2 border hi'>Hello {name ? name: ''}  !!!</h2>


      <CardGroup className='cardgroup'>

        <div className ='div'>

          <Card className='dashcard'>
            <CardImg
              alt="AI_Attemdance_System"
              src={aiimg}
              top
              width="100%"
            />
            <CardBody>
              <CardTitle tag="h4" className='hi'>
                #The_AI_Attendance_System
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                ...By VPolyServer
              </CardSubtitle>
              <CardText>
               The VPolyServer is a Project/Product By Students of VAPM Collage of Polytechnic, Latur.
               <br />
               Presenting You Our AI Attendance System To Automate and Monitor The Attendance of Students. <br />
               Yup ! Our Motto is "Let's Automate The Things !".
              </CardText>
             <Link to='/dashboard/ai'>
              <Button className='bg-dark'>
              <h4 >
              Capture <br /> AI Attendance !
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
            <CardBody>
              <CardTitle tag="h5" className='hi'>
                #Manual :: Attendace :: System
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                ...By VPolyServer
              </CardSubtitle>
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
            <CardBody>
              <CardTitle tag="h5" className='hi'>
                #View...The...Attendace
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
...By VPolyServer              </CardSubtitle>
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
       

{ role==='HOD' || role==='Admin' ? <StdFacCls /> : null}

      
      </CardGroup>
      {/* <h2>{userData.email}</h2>
      <h2>{userData.name}</h2> */}
      {/* <Link className='my-2 w-20 mx-auto' to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit' }}></Link> */}
      {/* <Link className='my-2 w-20 mx-auto' to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit' }}>

        <Button color="primary">
          Go to Profile of {userData.name}</Button>
      </Link> */}

<div className="logout my-2 mx-auto w-20">

      <Logoutbutton />
      </div>

    </div>
  );


}

export default Dashboard;