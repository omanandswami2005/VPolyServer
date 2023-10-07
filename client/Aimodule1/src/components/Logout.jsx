import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Logoutpage = () => {
    return (
        <div>
            <h1>You have been logged out, please login again</h1>
            <Link className='my-2 w-20 mx-auto' to="/login" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="primary">
                 Login Again  Here !!!</Button>
            </Link>
        </div>
    );


}

const Logoutbutton = () => {
    const navigate = useNavigate();
const logout = async () => {
    // Make a POST request to the `/logout` endpoint
    await axios.get('/logout');

    // Redirect the user to the login page
    // window.location.href = '/logout';
    navigate('/logout');

  };
    return (
        < Button onClick={logout}  color="primary">
        Logout</Button>
    );
}

export {  Logoutpage  ,  Logoutbutton};