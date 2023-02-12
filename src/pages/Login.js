import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBValidation,
  MDBValidationItem,
  MDBSpinner
}
from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/features/authSlice';
import { toast } from "react-toastify"

const Login = () => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });
  
  const [validationError, setValidationError] = useState({
    emailError: '',
    passwordError: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading } = useSelector( state => ({...state?.auth}));

  const onChange = (e) => {
    if(formValue.email) {
      setValidationError({...validationError, emailError: ''});
    }
    if(formValue.password) {
      setValidationError({...validationError, passwordError: ''});
    }
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

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
      setIsFormValid(false);
      return false;
    }

    setIsFormValid(true);
    setValidationError({ emailError: '', passwordError: '' });
    return true;
  };

  /* Submitting Form */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(formValue);
      dispatch(login({formValue, navigate, toast }))
      setFormValue({ email: '', password: ''})
    }
  };

  return (
    <MDBContainer className='my-5 p-lg-5'>
      <MDBCard>

        <MDBRow className='g-0 d-flex align-items-center shadow-1-strong'>

          <MDBCol md='4'>
            <MDBCardImage src='https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg' alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
          </MDBCol>

          <MDBCol md='8'>

            <MDBCardBody>

            <h2 className="fw-bold mb-5 text-center">Signin now</h2>


              <form onSubmit={handleSubmit}>
                <MDBValidation>
                  <MDBValidationItem invalid="Please enter email">
                    <MDBInput
                      value={formValue.email}
                      wrapperClass=''
                      label='Email address'
                      id='validationCustom01'
                      type='email'
                      required
                      name='email'
                      onChange={onChange}
                      feedback='Please enter a valid email address'
                  />
                    <p className='error-message text-danger'>{validationError.emailError}</p>
                  </MDBValidationItem>

                  <MDBValidationItem className='mb-4' invalid="Please enter password">
                    <MDBInput
                      wrapperClass=''
                      label='Password'
                      id='validationCustom02'
                      type='password'
                      value={formValue.password}
                      name='password'
                      required
                      onChange={onChange}
                      feedback='Password must be at least 8 characters long'
                      autoComplete='off'
                    />
                    <p className='error-message text-danger'>{validationError.passwordError}</p>
                  </MDBValidationItem>
                </MDBValidation>

                <MDBBtn className="mb-4 w-100" type='submit'>
                  { loading && <MDBSpinner style={{ width: '17px', height: '17px'}} role='status' size="sm" color="info" tag="span" className="me-2" /> }
                  Sign in
                </MDBBtn>
              </form>


            </MDBCardBody>

          </MDBCol>

        </MDBRow>

      </MDBCard>
    </MDBContainer>
  );
}

export default Login;

{/* <MDBContainer className="p-3 my-5 d-flex flex-column w-50"> */}
