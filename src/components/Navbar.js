import { useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { getToursBySearch } from '../redux/features/tourSlice';
import decode from "jwt-decode"

// icons
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// images(svg,png)
import Travel from "../images/Travel.svg"




function Navbar() {
  const navigate = useNavigate();
  const disaptch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchInputRef = useRef(null);


  const user = useSelector(state => state?.auth?.user);

  const userId = user?.result?._id;
  const token = user?.token;
  
  if(token) {
    const decodeToken = decode(token);
    if(decodeToken.exp * 1000 < new Date().getTime()) {
      disaptch(logout())
    }
  }

  const [state, setState] = useState({
    left: false,
  });

  /* Drawer for keyboard */
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
  
    setState({ left: open });
  };

  /* For MObile Drawer */
  const list = (anchor) => (
  <Box
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
    // sx={{ background: "#4db6ac"}}
  >
    { userId && <Typography component="h1" paddingX={5} paddingY={4} sx={{ fontSize: "25px", fontWeight: 600, fontStyle: "oblique", backgroundColor: "#00695c", color: "white"}}>{ user?.result?.name }</Typography> }
    <List>
        <ListItem className='d-block'>
          <ListItemButton 
             onClick={() => {
                user ? navigate("/tours/createOrEdit") :
                      navigate("/login");
              }}
          >
            <ListItemIcon sx={{ display: "contents"}}>
              <AddIcon /> 
            </ListItemIcon>
            <ListItemText primary="Add Post" sx={{ marginLeft: "10px"}} />
          </ListItemButton>

          { userId && (
             <ListItemButton onClick={ () => navigate(`tours/dashboard/${userId}`)}>
             <ListItemIcon  sx={{ display: "contents"}}>
               <DashboardIcon /> 
             </ListItemIcon>
             <ListItemText primary="Dashboard" sx={{ marginLeft: "10px"}}/>
           </ListItemButton>
          )}

          { userId ? (
          <ListItemButton onClick={() => disaptch(logout()) }>
            <ListItemIcon sx={{ display: "contents"}} >
              <LogoutIcon /> 
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ marginLeft: "10px"}} />
          </ListItemButton>
          ) : (
          <ListItemButton onClick={ () => navigate("/login") }>
            <ListItemIcon sx={{ display: "contents"}} >
              <LoginIcon /> 
            </ListItemIcon>
            <ListItemText primary="Login" sx={{ marginLeft: "10px"}} />
          </ListItemButton>

          ) }
        </ListItem>
    </List>
  </Box>
  );

  const Search = styled('form')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: "0%",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(searchInputRef.current.value);
    const search = searchInputRef.current.value;
    if(search) {
        disaptch(getToursBySearch(search))
        navigate(`tours/search?searchQuery=${search}`) ;  
    } else {
      navigate("/")
    }
  };

 
  return (
    <AppBar position="sticky" sx={{ background: "#009688"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Desktop start*/}
          <TravelExploreIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { color: "#64ffda"},
            }}
          >
            Travelastia
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
             <Button
                className="text-white m-2"
                 onClick={ () => {
                  user?.result?._id ? navigate("/tours/createOrEdit")
                       : navigate("/login")
                 }}
              >
                Add Post
              </Button>
              { user?.result?._id && (
                <Button
                  onClick = { () => {
                    navigate(`tours/dashboard/${userId}`)
                  }}
                  className="text-white m-2"
                  >
                  Dashboard
                </Button>
              )}
          </Box>
          { !isMobile && (
            <Box sx={{ display: "flex", alignItems: "center"}}>
              <>
                { userId ? (
                  <Button
                  className="text-white m-2"
                    onClick={() => {
                      disaptch(logout());
                    }}
                    >
                    Logout
                  </Button>
                ) : (
                  <Button
                  onClick={ () => navigate("/login")}
                  className="text-white m-2"
                  >
                    Login
                  </Button>
                )}
                <Tooltip title={user?.result?.name}>
                  <IconButton sx={{ p: 0 }}>
                    <Avatar>{ user?.result?.name[0] }</Avatar>
                  </IconButton>
                </Tooltip>
              </>
            </Box>
          )}
          {/* Desktop end */}

           
          {/* Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, width: "100%", alignItems: "center" }}>
            <IconButton
              size="large"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <IconButton color='inherit' size='large' onClick={ () => navigate("/")} sx={{ margin: "auto"}}>
             <TravelExploreIcon sx={{ display: { xs: 'flex', md: 'none', } }} />
            </IconButton>
            <Drawer open={state.left} onClose={toggleDrawer(false)}
              sx={{ '& .MuiDrawer-paper': { background: '#b2dfdb' } }}
            >
              {list()}
              <img src={Travel} style={{ width: "200px", margin: "auto"}} />
            </Drawer>
         </Box>

         <Search onSubmit={handleSearchSubmit}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              inputRef={searchInputRef}
            />
          </Search>

         {/* Mobile End */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;