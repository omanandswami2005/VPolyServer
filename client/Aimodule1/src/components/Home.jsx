import React from 'react'
// import 
import 'bootstrap/dist/css/bootstrap.css';

import i from '../images/Vpolyserver.png';
import imgstyle from '../styles/HomeStyles.js';
import '../styles/Home.css';


import { Link } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    Button
} from 'reactstrap';


import Image from "react-bootstrap/Image";

function Home() {
    return (
        <div style={{
            display: 'block'

        }}>
            
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "10vh" }}>
        <Image src={i} className="" style={imgstyle} />
      </div>
            <Container >
                <Row>
                    <Col>
                        <Card body>
                            <h5 className="display-4 font-italic text-center">Welcome to VPolyServer</h5>
                            <p className="lead">Your AI Attendance System.</p>
                            <hr className="my-2" />
                            <p>
                                VPolyServer is an advanced AI attendance system that simplifies attendance tracking for institutions and students using face recognization.
                            </p>
                           
                                
  <Link className='my-2 w-20 mx-auto' to="/login" style={{ textDecoration: 'none', color: 'inherit' }}><Button  color="primary">
    Go to Faculty Login</Button>
  </Link>


                           
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {/* ... Content rows here ... */}
                </Row>
            </Container>

        </div >
        
    );
}
  
export default Home;