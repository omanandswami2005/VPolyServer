import React from "react";
import facultymgmt from '../images/facultymgmt.jpg';
import classmgmt from '../images/classmgmt.jpg';
import schedule from '../images/schedule.jpg';
import { Button, Card, CardBody,  CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { Link } from 'react-router-dom';


export default function StdFacCls() {
    return (
    <>
     <div className ='div'>
          <Card className='dashcard'>
            <CardImg
              alt="Faculty Management System"
              src={facultymgmt}
              top
              width="100%"
            />
            <CardBody>
              <CardTitle tag="h4" className='hi'>
                #Faculty^Management^System
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                ...By VPolyServer
              </CardSubtitle>
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
              alt="Class Management System"
              src={classmgmt}
              top
              width="100%"
            />
            <CardBody>
              <CardTitle tag="h4" className='hi'>
                #Classes-&-Students-Management
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                ...By VPolyServer
              </CardSubtitle>
              <CardText>
                Want To Manage The Classes & Students Too ? <br />
                NO WORRY !!!<br />
               The VPolyServer is Here for You Where You Can CRUD (Create, View, Update, Delete) the students and classes of VAPM Collage. 
               This Will Help You To Manage All The Data Of Students And Their Classes As Well As You Can Create And Delete The Classes Too !!!
           <br />    Just Hit The Button Below & Start Managing !!!
               <br /> <br />
               Yup ! Our Motto is "Let's Automate The Things !"
              </CardText>

               <Link to='/dashboard/classstudentmgmt'>
              <Button className='bg-info' 
              > 
                <h4>
                  Manage Classes & <br /> Students !
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
              src={schedule}
              top
              width="100%"
            />
            <CardBody>
              <CardTitle tag="h4" className='hi'>
                #SchEdulE ;- Management
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                ...By VPolyServer
              </CardSubtitle>
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
    </>);
}