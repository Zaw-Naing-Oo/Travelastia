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
        <Route path='/tours/createTour' element={ <AddTour /> } />
        <Route path='/tour/:id' element={ <AddEditTour /> } />
      </Routes>
    </>
  )
}

export default App