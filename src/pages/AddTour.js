import React, { useState, useRef, useCallback, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { MuiChipsInput } from 'mui-chips-input'
import Dropzone from 'react-dropzone';
import {useSelector, useDispatch} from "react-redux"
import { createTour } from '../redux/features/tourSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';


  const AddTour = () => {

    const [ tourData, setTourData ] = useState({ title: "", description: "", tags: [] });
    const [chips, setChips] = React.useState([]);
    const submitButtonRef = useRef(null);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    // For error message
    const [validationError, setValidationError] = useState({
      titleError: '',
      descriptionError: '',
      tagsError: '',
    });

    // const [tagErrMsg, setTagErrMsg] = useState(null);

    const user = useSelector(state => state?.auth?.user);
    const { error, loading } = useSelector( state => ({...state?.tour}));
   
    // console.log(user);

    // const files = acceptedFiles.map(file => (
    //   <li key={file.path}>
    //     {file.path} - {file.size} bytes
    //   </li>
    // ));

    const handleChange = (e) => {
    setTourData( prevData => ({
      ...prevData,
      [e.target.name] : e.target.value
    }))
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
  
  }

    //  handle react-input-chip
    const handleChip = (newChips) => {
      setChips(newChips);
      setTourData( prevData => ({
        ...prevData,
        tags: newChips.map( chip => chip)
      }))
      setErrors((prevErrors) => ({ ...prevErrors, tags: '' }));
    }

    const onDrop = useCallback((acceptedFiles) => {
      const reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      // console.log(acceptedFiles[0]?.type);
      reader.onloadend = () => {
        setTourData({
          ...tourData,
          imageFile: reader?.result,
          imageName: acceptedFiles[0]?.name,
          imageType: acceptedFiles[0]?.type
        });
      };
    }, [tourData]);

    // Submit Form
    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
      if (!tourData.title) {
        newErrors.title = 'Title is required';
      }
      if (!tourData.description) {
        newErrors.description = 'Description is required';
      }
      if (chips.length === 0) {
        newErrors.tags = 'At least one tag is required';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        // console.log(tourData);
      }
      
      if (tourData.title && tourData.description && tourData.tags) {
      const updatedTourData = { ...tourData, name: user?.result?.name };
      console.log(updatedTourData);
      dispatch(createTour({ updatedTourData, navigate, toast }))
      }
      handleClear();
    };
    
    //  Clear From
    const handleClear = (e) => {
      setTourData({ title: "", description: "", tags: []}); 
    };

    // For Keyboard Enter 
    const handleKeyDown = event => {
      if (event.key === "Enter") {
        submitButtonRef.current.click();
        setTourData({ title: "", description: "", tags: []}); 
      }
    };


    useEffect(() => {
      error && toast.error(error);
    }, [error]);
  

    return (
    <Box sx={{margin: 'auto', marginTop: '3rem', maxWidth: 800, padding: isMobile ? 6 : 10 }}>
      <Typography variant="h4" align="center" component="h1" gutterBottom>
        Add Tour
      </Typography>
      
      
      <Box component="form" autoComplete='off'  noValidate encType='multipart/form-data'>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Grid container alignItems="flex-start" spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth 
                required
                name="title"
                type="text"
                label="Title"
                value={ tourData?.title || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                fullWidth
                required
                multiline
                rows={2}
                value={ tourData?.description || ""}
                label="Description"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiChipsInput 
                value={tourData.tags.map(chip => chip)} 
                fullWidth
                label="Tags"
                onChange={handleChip}
                error={errors.tags}
                helperText={errors.tags}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                // onDrop={(acceptedFiles) =>
                //   setTourData({...tourData, imageFile: acceptedFiles})
                // }
                onDrop={onDrop}
              >
                {({ getRootProps, getInputProps }) => (
                    <Box 
                      {...getRootProps({className: 'dropzone'})}
                      sx={{
                        border: "2px dashed black",
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                      >
                      <input {...getInputProps()} />
                      {!tourData?.imageFile ? (
                        <p className='text-black-50 m-0'>Add Picture Here</p>
                      ) : (
                        <Box>
                          <Typography>{tourData?.imageName}</Typography>
                          {/* <EditOutlinedIcon /> */}
                        </Box>
                      )}
                    </Box>
                  )}
              </Dropzone>
            </Grid>
            <Grid item style={{ marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className='me-3'
                ref={submitButtonRef}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      {/* <img src={tourImage} /> */}
    </Box>
  )}

  export default AddTour