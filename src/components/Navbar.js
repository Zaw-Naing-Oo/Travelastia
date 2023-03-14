import * as React from 'react';
import { useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import Drawer from '@mui/material/Drawer';
import { styled, alpha, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery } from '@mui/material';
import { getToursBySearch } from '../redux/features/tourSlice';
import decode from "jwt-decode"




function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [ search, setSearch ] = React.useState('');
  const navigate = useNavigate();
  const disaptch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchInputRef = useRef(null);


  const user = useSelector(state => state?.auth?.user);
  // const user = JSON.parse(localStorage.getItem("profile"));

  const userId = user?.result?._id;
  console.log(user)
  const token = user?.token;
  
  if(token) {
    const decodeToken = decode(token);
    if(decodeToken.exp * 1000 < new Date().getTime()) {
      disaptch(logout())
    }
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [state, setState] = React.useState({
    left: false,
  });

  /* Drawer for keyboard */
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
  
    setState({ left: open });
  };

  /* For Drawer */
  const list = (anchor) => (
  <Box
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <List>
        <ListItem className='d-block'>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon /> 
            </ListItemIcon>
            <ListItemText primary="Add Tour" onClick={() => {
              user ? navigate("/tours/createOrEdit") :
                     navigate("/login");
            }}/>
          </ListItemButton>

          { user && (
             <ListItemButton onClick={ () => navigate(`tours/dashboard/${userId}`)}>
             <ListItemIcon>
               <InboxIcon /> 
             </ListItemIcon>
             <ListItemText primary="Dashboard" />
           </ListItemButton>
          )}

          { user ? (
          <ListItemButton onClick={() => disaptch(logout()) }>
            <ListItemIcon>
              <InboxIcon /> 
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
          ) : (
          <ListItemButton onClick={ () => navigate("/login") }>
            <ListItemIcon>
              <InboxIcon /> 
            </ListItemIcon>
            <ListItemText primary="Login" />
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
    zIndex: 1,
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      zIndex: 0, 
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
    <AppBar position="sticky" sx={{ background: "#2e7d32"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* For Mobile start */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={state.left} onClose={toggleDrawer(false)}>
              {list()}
            </Drawer>
         </Box>
          {/* For Mobile end */}


          {/* For Desktop start */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
             <Button
                // to="/tours/createOrEdit"
                className="text-white m-2"
                 onClick={ () => {
                  user ? navigate("/tours/createOrEdit")
                       : navigate("/login")
                 }}
              >
                Add Tour
              </Button>
              { user && (
                <Button
                  // to={`tours/dashboard/${userId}`}
                  onClick = { () => {
                    navigate(`tours/dashboard/${userId}`)
                  }}
                  className="text-white m-2"
                  >
                  Dashboard
                </Button>
              )}
          </Box>


          <Box sx={{ display: "flex", alignItems: "center"}}>

            <Search onSubmit={handleSearchSubmit}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                // value={ search }
                // onChange={(e) => setSearch(e.target.value)} 
                inputRef={searchInputRef}
              />
            </Search>

           { !isMobile && (
            <>
              { user?.result?._id ? (
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
           )}
          </Box>
          {/* For Desktop end */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;