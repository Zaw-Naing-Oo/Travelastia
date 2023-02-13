import React, { useEffect, useRef, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBValidation,
  MDBValidationItem,
  MDBCardFooter
}
from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { register } from '../redux/features/authSlice';


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


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector( state => ({...state?.auth}));



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

  useEffect(() => {
    error && toast.error(error);
  }, [error]); 

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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(formValue);
      dispatch(register({formValue, navigate, toast }))
      setFormValue({ email: '', password: '', firstName: '', lastName: '', confirmPassword: ''})
    }
  };

   /* Detect Enter key */
   const handleKeyDown = event => {
    if (event.key === "Enter") {
      submitButtonRef.current.click();
    }
  };


  return (
    <MDBContainer className='my-5'>

      <MDBRow className='g-0 align-items-center'>

        <MDBCol col='12' md='6'>
          <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" class="w-100 rounded-4 shadow-4"
            alt="" fluid/>
        </MDBCol>

        <MDBCol col='12' md='6'>

          <MDBCard className='my-5 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)',  backdropFilter: 'blur(30px)'}}>
            <MDBCardBody className='p-5 shadow-5'>

              <h2 className="fw-bold mb-5 text-center">Sign up now</h2>

              <form onSubmit={handleSubmit}>
                <MDBValidation>
                  <MDBRow>
                    <MDBCol col='6'>
                      <MDBValidationItem>
                        <MDBInput
                          value={formValue.firstName}
                          name='firstName'
                          wrapperClass=''
                          onChange={onChange}
                          onKeyDown={handleKeyDown}
                          id='validationCustom01'
                          required
                          label='First name'
                        />
                       <p className='error-message text-danger'>{validationError.firstNameError}</p>
                      </MDBValidationItem>
                    </MDBCol>

                    <MDBCol col='6'>
                      <MDBValidationItem>
                        <MDBInput
                          value={formValue.lastName}
                          wrapperClass=''
                          name='lastName'
                          onChange={onChange}
                          onKeyDown={handleKeyDown}
                          id='validationCustom02'
                          required
                          label='Last name'
                        />
                    <p className='error-message text-danger'>{validationError.lastNameError}</p>
                      </MDBValidationItem>
                    </MDBCol>
                  </MDBRow>

                  <MDBValidationItem invalid="Please enter email">
                    <MDBInput
                      value={formValue.email}
                      wrapperClass=''
                      label='Email address'
                      id='validationCustom03'
                      type='email'
                      required
                      name='email'
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      feedback='Please enter a valid email address'
                  />
                    <p className='error-message text-danger'>{validationError.emailError}</p>
                  </MDBValidationItem>

                  <MDBValidationItem invalid="Please enter password">
                    <MDBInput
                      wrapperClass=''
                      label='Password'
                      id='validationCustom04'
                      type='password'
                      value={formValue.password}
                      name='password'
                      required
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      autoComplete='off'
                    />
                    <p className='error-message text-danger'>{validationError.passwordError}</p>
                  </MDBValidationItem>

                  <MDBValidationItem invalid="Please enter confirm password">
                    <MDBInput
                      wrapperClass=''
                      label='Confirm Password'
                      id='validationCustom05'
                      type='password'
                      value={formValue.confirmPassword}
                      name='confirmPassword'
                      required
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      autoComplete='off'
                    />
                    <p className='error-message text-danger'>{validationError.confirmPasswordError}</p>
                  </MDBValidationItem>

                </MDBValidation>
                <MDBBtn ref={submitButtonRef} className='w-100 mb-4' size='md' type='submit'>sign up</MDBBtn>
              </form>

            </MDBCardBody>
            <MDBCardFooter className='text-center'>
              <p className='d-inline me-2'>
                 Already have an account? 
                </p>
              <Link to="/login">
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