import React, { useState } from 'react';
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
  MDBValidationItem
}
from 'mdb-react-ui-kit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"


function Register() {

  const [formValue, setFormValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const [validationError, setValidationError] = useState({
    emailError: '',
    passwordError: '',
    firstNameError : '',
    lastNameError: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let emailError = '';
    let passwordError = '';
    let firstNameError = '';
    let lastNameError = '';

    if (!formValue.email) {
      emailError = 'Please enter email address';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValue.email)) {
      emailError = 'Invalid email address';
    }

    if (!formValue.password) {
      passwordError = 'Please enter password';
    }


    if (!formValue.firstName) {
      firstNameError = 'Please enter your first name';
    }

    if (!formValue.lastName) {
      lastNameError = 'Please enter your last name';
    }

    if (emailError || passwordError || firstNameError || lastNameError) {
      setValidationError({ emailError, passwordError, firstNameError, lastNameError });
      setIsFormValid(false);
      return false;
    }

    setIsFormValid(true);
    setValidationError({ emailError: '', passwordError: '', firstNameError: '', lastNameError: '' });
    return true;
  };


  /* Submitting Form */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm() && isFormValid) {
      console.log(formValue);
      // dispatch(login({formValue, navigate, toast }))
      setFormValue({ email: '', password: '', firstName: '', lastName: ''})
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
                      {/* <MDBInput 
                        wrapperClass='mb-4' 
                        label='First name' 
                        id='form1' 
                        type='text'
                      /> */}
                      <MDBValidationItem>
                        <MDBInput
                          value={formValue.firstName}
                          name='firstName'
                          wrapperClass=''
                          onChange={onChange}
                          id='validationCustom01'
                          required
                          label='First name'
                        />
                       <p className='error-message text-danger'>{validationError.firstNameError}</p>
                      </MDBValidationItem>
                    </MDBCol>

                    <MDBCol col='6'>
                      {/* <MDBInput 
                        wrapperClass='mb-4' 
                        label='Last name' 
                        id='form2' 
                        type='text'
                      /> */}
                      <MDBValidationItem>
                        <MDBInput
                          value={formValue.lastName}
                          wrapperClass=''
                          name='lastName'
                          onChange={onChange}
                          id='validationCustom02'
                          required
                          label='Last name'
                        />
                    <p className='error-message text-danger'>{validationError.lastNameError}</p>
                      </MDBValidationItem>
                    </MDBCol>
                  </MDBRow>

                  {/* <MDBInput 
                    wrapperClass='mb-4' 
                    label='Email' 
                    id='form3' 
                    type='email'
                  /> */}
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
                      feedback='Please enter a valid email address'
                  />
                    <p className='error-message text-danger'>{validationError.emailError}</p>
                  </MDBValidationItem>


                  {/* <MDBInput 
                    wrapperClass='mb-4' 
                    label='Password' 
                    id='form4' 
                    type='password'
                  /> */}
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
                      feedback='Password must be at least 8 characters long'
                      autoComplete='off'
                    />
                    <p className='error-message text-danger'>{validationError.passwordError}</p>
                  </MDBValidationItem>

                </MDBValidation>
                <MDBBtn className='w-100 mb-4' size='md' type='submit'>sign up</MDBBtn>
              </form>

              <div className="text-center">

                <p>or sign up with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='twitter' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='github' size="sm"/>
                </MDBBtn>

              </div>

            </MDBCardBody>
          </MDBCard>
        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default Register;