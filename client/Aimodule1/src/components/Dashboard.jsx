
import { Logoutbutton } from './Logout';
// import { Link } from 'react-router-dom';

import { Button,Card,CardImg,CardBody,CardGroup,CardSubtitle,CardText,CardTitle } from 'reactstrap';
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';



const Dashboard = (props) => {

const style = {
    display:'none'
}
const hs = useNavigate()
const cl = ()=>{
    hs('/dashboard/profile')
}
const userData = props.userData;
// console.log(props)
    return (

        <div>
            
        <div className='toast' style={style}>    {toast(`Welcome ${userData.name} Sir !!!`,{
            style: {
                color: 'black',
                background: 'linear-gradient(45deg, rgb(255, 171, 171), rgb(218, 218, 218))',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: 'times new roman',
               
            }
        })}</div>
            
            <CardGroup>
  <Card>
    <CardImg
      alt="Card image cap"
      src="https://picsum.photos/318/180"
      top
      width="100%"
    />
    <CardBody>
      <CardTitle tag="h5">
        Card title
      </CardTitle>
      <CardSubtitle
        className="mb-2 text-muted"
        tag="h6"
      >
        Card subtitle
      </CardSubtitle>
      <CardText>
        This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
      </CardText>
      <Button>
        Button
      </Button>
    </CardBody>
  </Card>
  <Card>
    <CardImg
      alt="Card image cap"
      src="https://picsum.photos/318/180"
      top
      width="100%"
    />
    <CardBody>
      <CardTitle tag="h5">
        Card title
      </CardTitle>
      <CardSubtitle
        className="mb-2 text-muted"
        tag="h6"
      >
        Card subtitle
      </CardSubtitle>
      <CardText>
        This card has supporting text below as a natural lead-in to additional content.
      </CardText>
      <Button>
        Button
      </Button>
    </CardBody>
  </Card>
  <Card>
    <CardImg
      alt="Card image cap"
      src="https://picsum.photos/318/180"
      top
      width="100%"
    />
    <CardBody>
      <CardTitle tag="h5">
        Card title
      </CardTitle>
      <CardSubtitle
        className="mb-2 text-muted"
        tag="h6"
      >
        Card subtitle
      </CardSubtitle>
      <CardText>
        This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.
      </CardText>
      <Button>
        Button
      </Button>
    </CardBody>
  </Card>
</CardGroup>
            <h2>{userData.email}</h2>
            <h2>{userData.name}</h2>
            {/* <Link className='my-2 w-20 mx-auto' to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit' }}></Link> */}
                
                <Button onClick= {cl} color="primary">
                Go to Profile</Button>
            
            <Logoutbutton />


        </div>
    );


}

export default Dashboard;