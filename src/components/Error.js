import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from "@mui/material/Button"
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react"
import * as ErrorLogo from "../images/Error.json";

const Error = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: isMobile ? "95%" : "60%",
        height: "auto",
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
      }}
  >
    <Lottie animationData={ErrorLogo} loop={true} autoplay />
    <Button sx={{ display: "block", width: "200px", background: "#26a69a", color: "white", marginX: "auto", "&:hover" : { boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", color: "#000", background: "#4db6ac", }}} onClick={ () => { navigate(-1)}}>Go Back</Button>
    {/* <Typography variant="h6">Oops, something went wrong!</Typography> */}
  </Box>
  )
}

export default Error