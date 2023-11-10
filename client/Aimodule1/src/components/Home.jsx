import React from 'react';
// import 
import 'bootstrap/dist/css/bootstrap.css';

import i from '../images/Vpolyserver.png';
import '../styles/imageStyle.css';
import '../styles/Home.css';


import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    Col,
    Container,
    Row
} from 'reactstrap';


import Image from "react-bootstrap/Image";

function Home() {
    return (
        <div style={{
            display: 'block'

        }}>

            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "10vh" }}>
                <Image src={i} className="logo" />
            </div>
            <Container className=''>
                <Row>
                    <Col>
                        <Card  className='homecard'>
                            <h5 className="display-4 font-italic text-center">Welcome to VPolyServer</h5>
                            <p className="lead">Your AI Attendance System.</p>
                            <hr className="my-2" />
                            <p>
                                VPolyServer is an advanced AI attendance system that simplifies attendance tracking for institutions and students using face recognization.
                            </p>


                            <Link className='mx-auto' to="/login" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="primary">
                                Go to Faculty Login</Button>
                            </Link>



                        </Card>
                        <Card  className='homecard'>
                            <h5 className="display-4 font-italic text-center">Welcome to MicroBuilder</h5>
                            <p className="lead">Your MicroBuilder Helper Is Here !!!</p>
                            <hr className="my-2" />
                            <p>
                                The Micro Builderis is an advanced Tool To Automate The Creation Of MicroProject (Certificates) Using NodeJS .
                            </p>


                            <Link className='mx-auto' to="https://microbuilder.onrender.com/" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="primary">
                                Go to MicroBuilder</Button>
                            </Link>

                        </Card>
                    </Col>
                </Row>

        
            </Container>

        </div >

    );
}

export default Home;