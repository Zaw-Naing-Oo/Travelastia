import React, { useState, useRef, useCallback, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { MuiChipsInput } from 'mui-chips-input'
import Dropzone from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify"
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getTourToEdit } from '../redux/api';
import { useCreateTourMutation, useUpdateTourMutation } from '../react-query/query';

// images
import city from "../images/city.jpg"


  const AddTour = () => {

    const [ tourData, setTourData ] = useState({ title: "", description: "", tags: [], imageFile: null, imageType: "", imageName: "" });
    const [chips, setChips] = React.useState([]);
    const submitButtonRef = useRef(null);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const user = JSON.parse(localStorage.getItem("profile"));
    const userId = user?.result?._id;
    const name = user?.result?.name;
 
   

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

    // react drop zone
    const onDrop = useCallback((acceptedFiles) => {
      const reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onloadend = () => {
        setTourData({
          ...tourData,
          imageFile: reader?.result,
          imageName: acceptedFiles[0]?.name,
          imageType: acceptedFiles[0]?.type
        });
        setErrors((prevErrors) => ({ ...prevErrors, imageFile: null }));
      };
    }, [tourData]);

    // query mutation
    const createTourMutation = useCreateTourMutation();
    const updateTourMutation = useUpdateTourMutation();

    // Submit Form
    const handleSubmit = async (e) => {
      e.preventDefault();

      const newErrors = {};
      if (!tourData.title) {
        newErrors.title = 'Title is required';
        
      }

      if (!tourData.description) {
        newErrors.description = 'Description is required';
        
      }

      if (chips.length === 0) {
        newErrors.tags = 'At least one tag country is required';
        
      }

      if (!tourData.imageFile) {
        newErrors.imageFile = 'Please select an image file';
      }
        
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      } 

      if (tourData.title && tourData.description && tourData.tags && tourData.imageFile) {
        if(!id) {
          const { title, description, imageFile, tags, imageType, imageName } = tourData;
          await createTourMutation.mutateAsync({ title, description, imageFile, tags, imageType, name, imageName, userId });
          toast.success("Create Post Successfully");
          navigate("/");
        } else {
          const { title, description, imageFile, tags, imageType, imageName } = tourData;
          await updateTourMutation.mutateAsync({ title, description, imageFile, tags, imageType, imageName, id });
          toast.success("Update Post Successfully");
          navigate("/");
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
        .then(async response => {
          const tour = await response?.data?.tour;
          console.log(tour);

          // For tags
          const fixTags = tour?.tags.join("").split(",");
          const uniqueTags = new Set([...chips, ...fixTags]); 
          setChips(Array.from(uniqueTags));

          setTourData({
            ...tourData,
            title: tour?.title,
            description: tour?.description,
            tags: Array.from(uniqueTags),
          });
            
        })
      } 
    }, [id]);


    // protection for not login
    useEffect( () => {
      if(!userId) {
        navigate("/login")
      }
    }, [userId])

  

    return (
      <Box sx={{ minHeight: "100vh", background : `url(${city})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", }}>
        <Box sx={{margin: 'auto', maxWidth: 600, padding: isMobile ? 6 : 7, }}>
          <Typography variant="h1" align="center"  gutterBottom sx={{ marginBottom: "2rem", fontStyle: "oblique"}}>
            { id ? "Update You Post" : "Share Your Experience"}
          </Typography>
          
          
          <Box component="form" autoComplete='off' noValidate encType='multipart/form-data' >
            { createTourMutation.error && (
              <h5 onClick={ () => createTourMutation.reset()}>{ createTourMutation.error}</h5>
            )}
            <Paper elevation={3} sx={{ padding: isMobile ? 2 : 5}} >
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
                    sx={{ 
                      "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1de9b6"  
                      },
                      "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1de9b6"  
                      }
                    }}
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
                    sx={{ 
                      "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1de9b6"  
                      },
                      "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1de9b6"  
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MuiChipsInput 
                    value={tourData.tags.map(chip => chip)} 
                    fullWidth
                    label="Country Tags"
                    onChange={handleChip}
                    error={errors.tags}
                    helperText={errors.tags}
                    sx={{ 
                      "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1de9b6"  
                      },
                      "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1de9b6"  
                      }
                    }}
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
                    sx={{ background: "#26a69a", color: "white", "&:hover" : { boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", background: "#4db6ac", }}}
                  >
                    { id ? 
                      updateTourMutation.isLoading ? "Updating..." : "Update"   
                      : 
                      createTourMutation.isLoading ? "Creating..." : "Create" }
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
        </Box>
      </Box>
  )}

  export default AddTour