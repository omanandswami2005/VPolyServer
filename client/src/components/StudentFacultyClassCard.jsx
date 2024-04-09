import React from "react";
import facultymgmt from '../images/facultymgmt.webp';
import classmgmt from '../images/classmgmt.webp';
import schedule from '../images/schedule.webp';
import { Button, Card, CardBody,  CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { useDarkMode } from '../DarkModeContext';
import { Link } from 'react-router-dom';


export default function StdFacCls( {role}) {
  const { isDarkMode } = useDarkMode();
  const cardSub=(
    <CardSubtitle
    className={`mb-2 ${!isDarkMode ? 'text-warning' : 'text-muted'}`}
    tag="h6"
  >
    ...By VPolyServer
  </CardSubtitle>
  )

    return ( role === 'HOD' || role === 'Admin' ?
    <>
 
     <div className ='div'>
          <Card className='dashcard'>
            <CardImg
              alt="Faculty Management"
              src={facultymgmt}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : '#ccc', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
              <CardTitle tag="h4" className='hi'>
                #Faculty^Management
              </CardTitle>
            {cardSub}
              <CardText>
              Here You Can Manange All Data Of The Faculties of VAPM Collage of Polytechnic, Latur.
               <br />
              
              </CardText>
             <Link to='/dashboard/faculty'>
              <Button className='bg-success'>
              <h4 >
              Faculty <br /> Management !
              </h4>
            </Button>
            </Link>
            
            </CardBody>
          </Card>
        </div>
        
        
        <div className ='div'>
          <Card className='dashcard'>
            <CardImg
              alt="Class Management"
              src={classmgmt}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : '#ccc', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
              <CardTitle tag="h4" className='hi'>
                #Classes-Management
              </CardTitle>
            {cardSub}
              <CardText>
                Want To Manage The Classes Too ? <br />
                NO WORRY !!!<br />
               The VPolyServer is Here for You Where You Can CRUD (Create, View, Update, Delete)  classes of VAPM Collage. 
               This Will Help You To Manage All The Data Of Classes As Well As You Can Create And Delete The Classes Too !!!
           <br />    Just Hit The Button Below & Start Managing !!!
               <br /> <br />
               Yup ! Our Motto is "Let's Automate The Things !"
              </CardText>

               <Link to='/dashboard/classManagement'>
              <Button className='bg-info' 
              > 
                <h4>
                  Manage Classes Now !
                </h4>
              </Button>
              </Link>
            </CardBody>
          </Card>
        </div>


        <div className ='div'>
          <Card className='dashcard'>
            <CardImg
              alt="Schedule Management"
              src={schedule}
              top
              width="100%"
            />
            <CardBody style={{backgroundColor: !isDarkMode ? 'black' : '#ccc', color: !isDarkMode ? 'white' : 'black',borderRadius:"10px"}}>
              <CardTitle tag="h4" className='hi'>
                #SchEdulE ;- Management
              </CardTitle>
            {cardSub}
              <CardText>
                Need Flexible Schedule as Well ? <br />
                Here we Go !!!<br /><br />
               The VPolyServer is Here for You <br /> 
               In This Section You Can Manage All the Schedule of Classes.<br /> 
               i.g. Creating The Time Slots, Updating The Time Slots, Deleting The Time Slots. <br />
           <br />    Just Hit The Button Below & Start Managing The Schedule !!!
               <br /> 
               Yup ! Our Motto is "Let's Automate The Things !"
              </CardText>

               <Link to='/dashboard/scheduleSetup'>
              <Button className='bg-tertiary' 
              > 
                <h4>
                  Manage Schedule <br /> Now !
                </h4>
              </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
    </> : <h2 className='bg-danger text-white w-50 mx-auto mt-2 border hi text-center'>Sorry, You Are Not Authorized To View This Page !</h2>);
}