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
import { create, createTour, updateTour } from '../redux/features/tourSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify"
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getTourToEdit } from '../redux/api';


  const AddTour = () => {

    const [ tourData, setTourData ] = useState({ title: "", description: "", tags: [], imageFile: null, imageType: "", imageName: "" });
    const [chips, setChips] = React.useState([]);
    const submitButtonRef = useRef(null);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const { id } = useParams();

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
      // console.log(acceptedFiles[0]);
      reader.onloadend = () => {
        setTourData({
          ...tourData,
          imageFile: reader?.result,
          imageName: acceptedFiles[0]?.name,
          imageType: acceptedFiles[0]?.type
        });
      };
      // console.log(reader);
    }, [tourData]);

    // Submit Form
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("chipsLength",chips.length);
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
        // console.log(tourData);
        if(!id) {
          const updatedTourData = { ...tourData, name: user?.result?.name };
          console.log(updatedTourData);
          // dispatch(create(updatedTourData));
          dispatch(createTour({ updatedTourData, navigate, toast }))
        } else {
          const updatedTourData = { ...tourData, name: user?.result?.name };
          console.log(updatedTourData);
          dispatch(updateTour({ updatedTourData, navigate, toast, id }))
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


    useEffect(() => {
      error && toast.error(error);
    }, [error]);

  

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
                accept="image/*"
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
                      {!tourData?.imageName ? (
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