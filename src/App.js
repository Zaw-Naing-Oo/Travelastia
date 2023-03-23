import React, { useEffect } from 'react'
import { ToastContainer } from "react-toastify"
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/features/authSlice';
import AddTour from './pages/AddTour';
import CssBaseline from "@mui/material/CssBaseline";
import TourDetail from './pages/TourDetail';
import Dashboard from './pages/Dashboard';
import { useNavigate } from 'react-router-dom';
import Error from './components/Error';


const App = () => {

  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();

  useEffect( () => {
    dispatch(setUser(user));
  }, []);

  return (
    <>
    <CssBaseline />
    <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element = { <Navigate to='/tours' /> } />
        
        <Route path='/tours' element={ <Home /> }>
          <Route path='search' element={ <Home /> } />
        </Route>
          <Route path='/tours/detail/:id' element={ <TourDetail /> } />
        <Route path='/tours/createOrEdit/:id?' element={ <AddTour /> } />
        <Route path='tours/dashboard/:id' element={ <Dashboard /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='*' element={ <Error /> } />
      </Routes>
    </>
  )
}

export default App