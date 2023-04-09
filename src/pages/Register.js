import React, { useRef, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBCardFooter,
  MDBSpinner
}
from 'mdb-react-ui-kit';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"


// images
import sun from "../images/sun.jpg"
import { useRegister } from '../react-query/query';



function Register() {

  const [formValue, setFormValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [validationError, setValidationError] = useState({
    firstNameError : '',
    lastNameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const submitButtonRef = useRef(null);
  const navigate = useNavigate();
  const { mutate, isLoading  } = useRegister();


  const onChange = (e) => {

    if(formValue.firstName) {
      setValidationError({...validationError, firstNameError: ''});
    }
    if(formValue.lastName) {
      setValidationError({...validationError, lastNameError: ''});
    }
    if(formValue.email) {
      setValidationError({...validationError, emailError: ''});
    }
    if(formValue.password) {
      setValidationError({...validationError, passwordError: ''});
    }
    if(formValue.confirmPassword) {
      setValidationError({...validationError, confirmPasswordError: ''});
    }

    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };


  /* Form validation */
  const validateForm = () => {
    let firstNameError = '';
    let lastNameError = '';
    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = '';

    if (!formValue.firstName) {
      firstNameError = 'Please enter your first name';
    }

    if (!formValue.lastName) {
      lastNameError = 'Please enter your last name';
    }

    if (!formValue.email) {
      emailError = 'Please enter email address';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValue.email)) {
      emailError = 'Invalid email address';
    }

    if (!formValue.password) {
      passwordError = 'Please enter password';
    }

    if (!formValue.confirmPassword) {
      confirmPasswordError = 'Please enter confirm password';
    }

    if(formValue.password !== formValue.confirmPassword) {
      confirmPasswordError = 'Password does not match';
    }


    if (emailError || passwordError || firstNameError || lastNameError || confirmPasswordError) {
      setValidationError({ emailError, passwordError, firstNameError, lastNameError, confirmPasswordError });
      return false;
    }

    setValidationError({ emailError: '', passwordError: '', firstNameError: '', lastNameError: '', confirmPasswordError: '' });
    return true;
  };


  /* Submitting Form */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(formValue);

      await mutate(formValue, {
        onSuccess: (data) => {
          toast.success('Register Successfully');
          navigate('/');
          setFormValue({ email: '', password: '', firstName: '', lastName: '', confirmPassword: ''})
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
    <MDBContainer className=''>

      <MDBRow className='g-0 align-items-center' >

        <MDBCol col='12' md='6' className='mt-5 my-lg-5'>
          <img src={sun} class="w-100 rounded-4 shadow-4"
            alt="" fluid/>
        </MDBCol>

        <MDBCol col='12' md='6' className=' mb-5 mb-lg-0'>

          <MDBCard className='cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)', minHeight: "100vh", background : "#78909c"}}>
            <MDBCardBody className='p-5 shadow-5 text-center'>

            <Typography component="a" href='/' sx={{ fontWeight: 800, fontSize: "2.5rem", color: "#1de9b6", '&:hover': { color: "#64ffda"}, }}>Travelastia</Typography>
              <h2 className="fw-bold mb-5 text-center" >Sign up now</h2>

              <form onSubmit={handleSubmit}>
                  <MDBRow>
                    <MDBCol col='6'>
                      <TextField 
                        label="FristName" 
                        required
                        autoComplete='off'
                        type="text"
                        name="firstName"
                        value={formValue.firstName}
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
                      <p className='error-message text-danger d-flex'>{validationError.firstNameError}</p>
                    </MDBCol>

                    <MDBCol col='6'>
                      <TextField 
                        label="LastName" 
                        required
                        autoComplete='off'
                        type="text"
                        name="lastName"
                        value={formValue.lastName}
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
                      <p className='error-message text-danger d-flex'>{validationError.lastNameError}</p>
                    </MDBCol>
                  </MDBRow>

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

                  <TextField 
                    label="Confirm Password" 
                    color="primary"  
                    required
                    autoComplete='off'
                    type="password"
                    name="confirmPassword"
                    value={formValue.confirmPassword}
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
                  <p className='error-message text-danger d-flex'>{validationError.confirmPasswordError}</p>

                <MDBBtn ref={submitButtonRef} className='w-100 mb-4 p-3' size='md' type='submit' style={{ background: "#1de9b6", fontSize: "15px"}}>
                  { isLoading && <MDBSpinner style={{ width: '17px', height: '17px'}} role='status' size="sm" tag="span" className="me-2" />}
                    sign up 
                  </MDBBtn>
              </form>

            </MDBCardBody>
            <MDBCardFooter className='text-center'>
              <p className='d-inline me-2'>
                 Already have an account? 
                </p>
              <Link to="/login" style={{ color: "#1de9b6", '&:hover': { color: "#64ffda"}, }}>
                Log In
              </Link>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default Register;