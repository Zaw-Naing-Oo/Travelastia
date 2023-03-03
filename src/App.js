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
import AddEditTour from './pages/AddEditTour';
import CssBaseline from "@mui/material/CssBaseline";
import TourDetail from './pages/TourDetail';
import Dashboard from './pages/Dashboard';


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
        <Route path='/tours' element={ <Home /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='/tours/createOrEdit/:id?' element={ <AddTour /> } />
        <Route path='/tour/:id' element={ <AddEditTour /> } />
        <Route path='/tours/detail/:id' element={ <TourDetail /> } />
        <Route path='/tours/dashboard/:id' element={ <Dashboard /> } />
      </Routes>
    </>
  )
}

export default App