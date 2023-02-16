import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { MuiChipsInput } from 'mui-chips-input'
import Dropzone from 'react-dropzone';
import {useSelector} from "react-redux"

const AddTour = () => {

  const [ tourData, setTourData ] = useState({ title: "", description: "", tags: [] });
  const [tagErrMsg, setTagErrMsg] = useState(null);

  const user = useSelector(state => state?.auth);
  console.log(tourData);
  console.log(tourData?.imageFile);
  // console.log(user);

  // const files = acceptedFiles.map(file => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  const handleChange = (e) => {
    setTourData({...tourData, [e.target.name] : e.target.value });
  }

  return (
  <Box style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
    <Typography variant="h4" align="center" component="h1" gutterBottom gutter>
      Add Tour
    </Typography>
    
    
    <Box component="form" autoComplete='off'  noValidate>
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
            />
          </Grid>
          <Grid item xs={12}>
            <MuiChipsInput 
              name='tags'
              value={tourData?.tags} 
              fullWidth
              label="Tags"
            />
          </Grid>
          <Grid item xs={12}>
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) =>
                  setTourData({...tourData, imageFile: acceptedFiles})
                }
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
                      <p className='m-0 text-black-50'>Add Picture</p>
                      {!tourData?.imageFile ? (
                        <p>Add Picture Here</p>
                      ) : (
                        <Box>
                          <Typography>{tourData?.imageFile?.name}</Typography>
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
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              type="submit"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </Box>
)}

export default AddTour