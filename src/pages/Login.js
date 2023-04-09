import React, { useState, useRef } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBCardFooter,
}
from 'mdb-react-ui-kit';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { googleLogin } from '../redux/features/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import  jwt_decode from 'jwt-decode'
import { toast } from "react-toastify"


// react query
import { useLogin } from '../react-query/query';

// image
import paris from "../images/paris.jpg"

const Login = () => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });
  
  const [validationError, setValidationError] = useState({
    emailError: '',
    passwordError: '',
  });

  const submitButtonRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isLoading } = useLogin();

  const onChange = (e) => {
    if(formValue.email) {
      setValidationError({...validationError, emailError: ''});
    }
    if(formValue.password) {
      setValidationError({...validationError, passwordError: ''});
    }
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };


  /* Form Validation */
  const validateForm = () => {
    let emailError = '';
    let passwordError = '';

    if (!formValue.email) {
      emailError = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValue.email)) {
      emailError = 'Invalid email address';
    }

    if (!formValue.password) {
      passwordError = 'Password is required';
    }

    if (emailError || passwordError) {
      setValidationError({ emailError, passwordError });
      return false;
    }

    setValidationError({ emailError: '', passwordError: '' });
    return true;
  };


  /* Submitting Form */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {

      await mutate(formValue, {
        onSuccess: (data) => {
          toast.success('Login Successfully');
          navigate('/');
          setFormValue({ email: '', password: ''})
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message);
        }
      })
    }
  };

  /* Detect Enter key */
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      submitButtonRef.current.click();
    }
  };


  return (
    <MDBContainer className='p-5'>
      <MDBCard style={{ background : "#78909c" }} className="my-5">
        <MDBRow className='g-0 d-flex align-items-center shadow-1-strong' >

          <MDBCol md='6' className=''>
            <MDBCardImage src={paris} alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='p-5 text-center'>

              <Typography component="a" href='/' sx={{ fontWeight: 800, fontSize: "2.5rem", color: "#1de9b6", '&:hover': { color: "#64ffda"}, }}>Travelastia</Typography>
              <h2 className="fw-bold mb-4 mt-4 text-center">Signin Now</h2>

              <Box component="form" autoComplete='off' encType='multipart/form-data' onSubmit={handleSubmit}>
                  <TextField 
                    label="Email" 
                    required
                    autoComplete='off'
                    type="email"
                    name="email"
                    value={formValue.email}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    sx={{
                      width: "100%",
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#1de9b6"  
                      },
                      "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1de9b6"  
                      }
                    }}
                  />
                  <p className='error-message text-danger d-flex'>{validationError.emailError}</p>

                  <TextField 
                    label="Password" 
                    color="primary"  
                    required
                    autoComplete='off'
                    type="password"
                    name="password"
                    value={formValue.password}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    sx={{
                      width: "100%",
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#1de9b6"  
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1de9b6"
                      }
                    }}
                  />
                  <p className='error-message text-danger d-flex'>{validationError.passwordError}</p>

                <MDBBtn ref={submitButtonRef} className="mb-4 w-100 p-3" type='submit' style={{ background: "#1de9b6", fontSize: "15px"}}>
                  { isLoading && <MDBSpinner style={{ width: '17px', height: '17px'}} role='status' size="sm" tag="span" className="me-2" /> }
                  Sign in
                </MDBBtn>
              </Box>

              <div className="text-center">
                <p>or sign up with:</p>

                 {/* Google Login  */}
                  <div className='d-flex justify-content-center align-items-center'>
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      const token = credentialResponse?.credential;
                      const decodeGoogleToken = jwt_decode(token);
                      // console.log(formValue);
                      dispatch(googleLogin({decodeGoogleToken, navigate, toast }));
                    }}
                    shape="square"
                    type='icon'
                    theme='outline'
                    logo_alignment='center'
                    onError={() => {
                      toast.error("Something is wrong")
                    }}
                  />
                  </div>
              </div>

            </MDBCardBody>

            <MDBCardFooter className='text-center border-0'>
              <p className='d-inline me-2'>
                 Do not  have an account? 
                </p>
              <Link to="/register" style={{ color: "#1de9b6", '&:hover': { color: "#64ffda"}, }}>
                Register
              </Link>
            </MDBCardFooter>
          </MDBCol>

        </MDBRow>

      </MDBCard>
    </MDBContainer>
  );
}

export default Login;

