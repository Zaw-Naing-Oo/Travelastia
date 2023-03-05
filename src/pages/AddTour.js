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
import {  createTour, updateTour } from '../redux/features/tourSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify"
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getTourToEdit } from '../redux/api';


  const AddTour = () => {

    const [ tourData, setTourData ] = useState({ title: "", description: "", tags: [], imageFile: null, imageType: "", imageName: "" });
    const [chips, setChips] = React.useState([]);
    const submitButtonRef = useRef(null);
    const [errors, setErrors] = useState({
      
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const user = JSON.parse(localStorage.getItem("profile"));
 
    const { error, loading } = useSelector( state => ({...state?.tour}));
   

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
      // console.log(acceptedFiles[0]);
      reader.onloadend = () => {
        setTourData({
          ...tourData,
          imageFile: reader?.result,
          imageName: acceptedFiles[0]?.name,
          imageType: acceptedFiles[0]?.type
        });
        setErrors((prevErrors) => ({ ...prevErrors, imageFile: null }));
      };
      // console.log(reader);
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

      if (!tourData.imageFile) {
        newErrors.imageFile = 'Please select an image file';
      }
        
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      } 

      if (tourData.title && tourData.description && tourData.tags && tourData.imageFile) {
        // console.log(tourData);
        if(!id) {
          const tocreateTour = { ...tourData, name: user?.result?.name };
          console.log(tocreateTour);
          // dispatch(create(updatedTourData));
          dispatch(createTour({ tocreateTour, navigate, toast }))
        } else {
          const toUpdateTour = { ...tourData, name: user?.result?.name };
          console.log(toUpdateTour);
          dispatch(updateTour({ toUpdateTour, navigate, toast, id }))
        }

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

    // showing old data by fetching in the input field
    useEffect( () => {
       if(id) {
        getTourToEdit(id)
        .then(response => {
          const tour = response?.data?.tour;
          // console.log(tour);
          // console.log(tour?.image);

          // For tags
          const fixTags = tour?.tags.join("").split(",");
          // console.log(fixTags);
          const uniqueTags = new Set([...chips, ...fixTags]); 
          setChips(Array.from(uniqueTags));


          // For image
          const bufferImagte = tour?.image  
          const imageData = bufferImagte?.data?.data; // Replace with buffer array image
          const contentType = bufferImagte?.contentType; // Replace with the content type of image
          const fileName = bufferImagte?.imageName; // Replace with the file name of image
          const blob = new Blob([imageData], { type: contentType });
          const file = new File([blob], fileName, { type: contentType });
          const reader = new FileReader(); // use reader
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            setTourData({
              ...tourData,
              title: tour?.title,
              description: tour?.description,
              tags: Array.from(uniqueTags),
              imageFile: reader?.result,
              imageName: file?.name,
              imageType: file?.type,
            });
          };
          
        })
      }
    }, [id]);


    // For Toast Error
    useEffect(() => {
      error && toast.error(error);
    }, [error]);

    // protection for not login
    useEffect( () => {
      if(!user) {
        navigate("/login")
      }
    }, [user])

  

    return (
    <Box sx={{margin: 'auto', marginTop: '3rem', maxWidth: 800, padding: isMobile ? 6 : 10 }}>
      <Typography variant="h4" align="center" component="h1" gutterBottom>
        { id ? "Update Tour" : "Add tour"}
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
                helperText={errors.title ? "Title is Required" : ""}
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
                accept="image/*"
                multiple={false}
                onDrop={onDrop}
              >
                {({ getRootProps, getInputProps }) => (
                    <Box 
                      {...getRootProps({className: 'dropzone'})}
                      sx={{
                        border: "2px dashed black",
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                      >
                      <input {...getInputProps()} />
                      {!tourData?.imageName ? (
                        <p className='text-black-50 m-0'>Add Picture Here</p>
                      ) : (
                        <Box>
                          <Typography>{tourData?.imageName}</Typography>
                        </Box>
                      )}
                      {errors.imageFile && (
                        <Typography color="error" variant="caption" sx={{ position: "absolute", left: 10,  bottom: -25}}>
                          {errors.imageFile}
                        </Typography>
                      )}
                    </Box>
                  )}
              </Dropzone>
            </Grid>
            <Grid item style={{ marginTop: 20 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className='me-3'
                ref={submitButtonRef}
                onClick={handleSubmit}
              >
                { id ? "Update" : "Submit"}
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