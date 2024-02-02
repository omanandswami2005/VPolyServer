import * as React from 'react';
import img from '../images/Vpolyserver.png';
import Image from "react-bootstrap/Image";
import '../styles/ResponsiveDrawer.css'
import { Logoutbutton } from './Logout';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Cookies from 'js-cookie';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import DarkModeToggler from './DarkModeButton/DarkModeToggler';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { Link } from 'react-router-dom';
import { Button, Typography, } from '@mui/material';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 250;

function ResponsiveDrawer(props) {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isFixed, setIsFixed] = React.useState(true);
  const handleToggleFixed = () => {
    setIsFixed(!isFixed);
    // Save the state to cookies
    Cookies.set('isFixed', String(!isFixed));
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };



  const drawer = (
    // <ThemeProvider theme={!isDarkMode ? darkTheme : theme } >
    <div>
     {/* <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
<Typography variant="h6" noWrap component="div" align='center'>
Omanand Swami      <br /> <Logoutbutton />

</Typography>
     </Toolbar>
     <hr /> <Divider /> */}
      <List>
        <ListItem sx={{ display: 'flex', justifyContent: 'end' }} >
          <IconButton onClick={handleDrawerClose} >
             <ChevronLeftIcon  /> 
          </IconButton>
          </ListItem>
          <ListItem >
            <ListItemButton>
            <Link to='/dashboard/studentManagement' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" color='success'>

                  Manage Students!

                </Button>
              </Link>
            </ListItemButton>
          </ListItem>
               <Divider/>


          <ListItem >
            <ListItemButton>
            <Link to='/dashboard/viewattendance' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" style={{ backgroundColor: 'white', color: 'black' }} >Manage  Attendance!</Button>
              </Link>
            </ListItemButton>
          </ListItem>
               <Divider/>





          <ListItem >
            <ListItemButton>
            <Link to='/dashboard/startmanualattendance' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" color='error'>Manual Attendance!</Button>
              </Link>
            </ListItemButton>
          </ListItem>
          <Divider/>



          <ListItem >
            <ListItemButton>
            <Link to='/dashboard/classManagement' className='mx-2 NavBtn'>
                <Button size="small" style={{ backgroundColor: 'black', color: 'white', border: '1px solid white' }} variant="contained"
                >

                  Manage Classes!

                </Button>
              </Link>
            </ListItemButton>
          </ListItem>
               <Divider/>


          <ListItem >
            <ListItemButton>
             <Link to='/dashboard/scheduleSetup' className='mx-2 NavBtn'>
                <Button size="small" color='primary' variant="contained"
                >

                  Manage Schedule!

                </Button>
              </Link>
            </ListItemButton>
          </ListItem>
               <Divider/>

          <ListItem >
            <ListItemButton>
            <Link to='/dashboard/faculty' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" color='secondary'>

                  Manage Faculties!

                </Button>
              </Link>
            </ListItemButton>
          </ListItem>
               <Divider/>

     
      </List>

     <Divider/>
    
    </div>

  );

  React.useEffect(() => {
    // Load the state from cookies
    const storedIsFixed = Cookies.get('isFixed');
    if (storedIsFixed !== undefined) {
      setIsFixed(storedIsFixed === 'true');
    }
  }, []);


  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
      <Box sx={{ display: 'flex', }}>
        <CssBaseline />
        <AppBar
          position={isFixed ? 'fixed' : 'absolute'}   
          sx={{
            backgroundColor: 'rgba(0, 0, 0, .6)',
            zIndex: 100,
          }}
        >
          <Toolbar className='d-flex justify-content-evenly align-items-center'
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              // sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>



            {/* <Image src={img} className="logo1 " /> */}

            <Link to='/dashboard' className='mx-2 NavBtn'>
               

                 <HomeTwoToneIcon fontSize='large' sx={{ color: 'white' }} />

            
              </Link>


            {/* <div className="navButtons border rounded p-1 mx-2 my-1  border-light" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >

              <Link to='/dashboard/viewattendance' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" style={{ backgroundColor: 'white', color: 'black' }} >Manage <br /> Attendance !</Button>
              </Link>


              <Link to='/dashboard/studentManagement' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" color='success'>

                  Manage <br /> Students !

                </Button>
              </Link>
              <Link to='/dashboard/startmanualattendance' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" color='error'>Manual <br /> Attendance !</Button>
              </Link>



              <Link to='/dashboard/classManagement' className='mx-2 NavBtn'>
                <Button size="small" style={{ backgroundColor: 'black', color: 'white', border: '1px solid white' }} variant="contained"
                >

                  Manage <br /> Classes !

                </Button>
              </Link>
              <Link to='/dashboard/scheduleSetup' className='mx-2 NavBtn'>
                <Button size="small" color='primary' variant="contained"
                >

                  Manage<br />Schedule !

                </Button>
              </Link>


              <Link to='/dashboard/faculty' className='mx-2 NavBtn'>
                <Button size="small" variant="contained" color='secondary'>

                  Manage <br /> Faculties !

                </Button>
              </Link>

            </div> */}
           
            <DarkModeToggler />
            <div className="logoutBtn">
            <Logoutbutton />
            </div>
            <IconButton color="inherit" onClick={handleToggleFixed}>
              {isFixed ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>


          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
         
          <Drawer
            container={container}
            variant="responsive"
            open={mobileOpen}
            anchor="left"
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

        </Box>
      </Box>
  );
}

export default ResponsiveDrawer;